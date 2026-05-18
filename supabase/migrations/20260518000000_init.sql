-- Create code_reviews table to store review history
create table if not exists code_reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  repo_name text not null,
  repo_owner text not null,
  file_path text not null,
  file_content text,
  review_result text,
  reviewed_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists idx_code_reviews_user_id on code_reviews(user_id);
create index if not exists idx_code_reviews_repo on code_reviews(repo_owner, repo_name);
create index if not exists idx_code_reviews_created_at on code_reviews(created_at desc);

-- Enable Row Level Security
alter table code_reviews enable row level security;

-- Create RLS policy: Users can only see their own reviews
create policy "Users can view their own reviews"
  on code_reviews
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reviews"
  on code_reviews
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on code_reviews
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on code_reviews
  for delete
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-update updated_at
create trigger update_code_reviews_updated_at
  before update on code_reviews
  for each row
  execute function update_updated_at_column();
