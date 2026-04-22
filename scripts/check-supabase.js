import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');

function loadEnvFile(path) {
  if (!existsSync(path)) return;

  const content = readFileSync(path, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    process.env[key] ??= value.replace(/^['"]|['"]$/g, '');
  }
}

function printPass(message) {
  console.log(`PASS ${message}`);
}

function printWarn(message) {
  console.warn(`WARN ${message}`);
}

function fail(message, error) {
  console.error(`FAIL ${message}`);
  if (error?.message) console.error(error.message);
  process.exitCode = 1;
}

async function cleanupProbeRows(supabase, userIdPattern) {
  const { error: attemptsCleanupError } = await supabase
    .from('case_attempts')
    .delete()
    .like('user_id', userIdPattern);

  if (attemptsCleanupError) {
    printWarn(`Could not clean old probe case_attempts rows: ${attemptsCleanupError.message}`);
  }

  const { error: usersCleanupError } = await supabase
    .from('app_users')
    .delete()
    .like('user_id', userIdPattern);

  if (usersCleanupError) {
    printWarn(`Could not clean old probe app_users rows: ${usersCleanupError.message}`);
  }
}

async function main() {
  loadEnvFile(envPath);

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    fail('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
    return;
  }

  printPass('Supabase environment variables found.');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  await cleanupProbeRows(supabase, 'SUPABASE_CHECK_%');

  const probeUserId = `SUPABASE_CHECK_${Date.now()}`;
  let createdUser = false;
  let insertedAttempt = false;

  try {
    const { error: userError } = await supabase
      .from('app_users')
      .upsert({ user_id: probeUserId }, { onConflict: 'user_id' });

    if (userError) {
      fail('app_users upsert failed. Check schema and RLS insert/update policy.', userError);
      return;
    }

    createdUser = true;
    printPass('app_users upsert allowed.');

    const attemptPayload = {
      user_id: probeUserId,
      case_id: 'nose_allergic_rhinitis',
      domain: 'nose',
      language: 'zh',
      pre_test_score: null,
      interactive_score: 0,
      post_test_score: null,
      answers: { source: 'scripts/check-supabase.js' },
    };

    const { error: insertError } = await supabase
      .from('case_attempts')
      .insert(attemptPayload);

    if (insertError) {
      fail('case_attempts insert failed. Check schema and RLS insert policy.', insertError);
      return;
    }

    insertedAttempt = true;
    printPass('case_attempts insert allowed.');

    const { data: attempts, error: selectError } = await supabase
      .from('case_attempts')
      .select('case_id, domain, interactive_score')
      .eq('user_id', probeUserId);

    if (selectError) {
      fail('case_attempts select failed. Check schema and RLS select policy.', selectError);
      return;
    }

    if (!attempts?.some((attempt) => attempt.case_id === attemptPayload.case_id)) {
      fail('case_attempts select returned no probe row. Check RLS select visibility.');
      return;
    }

    printPass('case_attempts select allowed.');
  } finally {
    if (insertedAttempt) {
      const { error: attemptsCleanupError } = await supabase
        .from('case_attempts')
        .delete()
        .eq('user_id', probeUserId);

      if (attemptsCleanupError) {
        printWarn(`Could not delete probe case_attempts row: ${attemptsCleanupError.message}`);
      } else {
        printPass('Probe case_attempts row cleaned up.');
      }
    }

    if (createdUser) {
      const { error: usersCleanupError } = await supabase
        .from('app_users')
        .delete()
        .eq('user_id', probeUserId);

      if (usersCleanupError) {
        printWarn(`Could not delete probe app_users row: ${usersCleanupError.message}`);
      } else {
        printPass('Probe app_users row cleaned up.');
      }
    }
  }
}

main().catch((error) => {
  fail('Unexpected Supabase check failure.', error);
});
