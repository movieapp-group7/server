-- create policy start
create policy "public can read account"
on public.account
for select to anon
using (true);

create policy "public can read reviews"
on public.reviews
for select to anon
using (true);

create policy "public can read favorites"
on public.favorites
for select to anon
using (true);

create policy "public can read group"
on public.groups
for select to anon
using (true);

create policy "public can read groupmembers"
on public.groupmembers
for select to anon
using (true);
-- create policy end