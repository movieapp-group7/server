

drop table if exists account;


create table account(
id serial primary key,
username varchar(20) not null,
email varchar(50) unique not null,
password varchar(255) not null);