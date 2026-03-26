#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('=== Création d\'un utilisateur administrateur ===\n');

  const supabaseUrl = "https://eszfbtqkqzmgrwuahxxz.supabase.co";
  // const supabaseServiceKey = await question(
  //   'Entrez votre Supabase Service Role Key: '
  // );
  const supabaseServiceKey = "sb_publishable_fHrRURQOdnEgpNx2LJu3bg_amDVXCSF"

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('URL Supabase ou Service Key manquante');
    rl.close();
    return;
  }

  const email = await question('Email de l\'admin: ');
  const password = await question('Mot de passe: ');
  const displayName = await question('Nom d\'affichage (default: Administrateur): ');

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log('\nCréation de l\'utilisateur...');

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: displayName || 'Administrateur',
        },
      });

    if (authError) throw authError;

    console.log('Utilisateur créé:', authData.user.email);

    console.log('Configuration du profil admin...');

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', authData.user.id);

    if (profileError) throw profileError;

    console.log('\n✅ Administrateur créé avec succès!');
    console.log('Email:', email);
    console.log('Vous pouvez maintenant vous connecter à l\'application.\n');
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  } finally {
    rl.close();
  }
}

createAdmin();
