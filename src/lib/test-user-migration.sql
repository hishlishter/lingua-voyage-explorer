
-- First check if the test user exists in the auth.users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test@example.com'
  ) THEN
    -- Insert test user if not exists
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) 
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'test@example.com',
      -- This is a hash for 'password123'
      crypt('password123', gen_salt('bf')),
      NOW(),
      null,
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Test User"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
    
    -- Get the user ID for the test user
    DECLARE test_user_id UUID;
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com';
    
    -- Create profile for test user if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = test_user_id) THEN
      INSERT INTO public.profiles (
        id,
        name,
        email,
        tests_completed,
        courses_completed,
        created_at
      ) VALUES (
        test_user_id,
        'Test User',
        'test@example.com',
        0,
        0,
        NOW()
      );
    END IF;
  END IF;
END $$;
