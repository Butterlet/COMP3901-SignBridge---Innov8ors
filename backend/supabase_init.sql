-- Supabase initialization SQL for SignBridge

create table if not exists public.users (
  id bigserial primary key,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  jsl_level text not null,
  username text not null unique,
  email text not null unique,
  password text not null,
  inserted_at timestamptz default now()
);

create table if not exists public.flashcards (
  id bigserial primary key,
  category text,
  image_url text,
  label text,
  options jsonb,
  correct integer,
  inserted_at timestamptz default now()
);

create table if not exists public.quiz_results (
  id bigserial primary key,
  user_id bigint,
  quiz_name text,
  score integer,
  total integer,
  percentage numeric,
  created_at timestamptz default now()
);

create table if not exists public.user_progress (
  user_id bigint primary key,
  quizzes_taken integer default 0,
  average_score integer default 0,
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_quiz_results_user_id on public.quiz_results (user_id);
create index if not exists idx_flashcards_category on public.flashcards (category);
