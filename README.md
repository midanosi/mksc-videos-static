# mksc-videos-static

Using SQLite, Next.js & Prisma. It uses Next.js' SSG (static site generation), meaning each page of the site is built ahead of time (including baking in the data from the YT api requests for player names and video dates).
Made with starter repo for Next.js+Prisma (therefore an old version of nextjs) [Next.js + Prisma Tutorial](https://leerob.io/blog/next-prisma).

## Requirements

- Node 10+ (this is from an old starter repo)
- Yarn (or NPM if you prefer)

## Getting Started

After cloning the repository, you can run `yarn` to install the dependencies and then start the application with `yarn dev`.

```bash
$ git clone https://github.com/midanosi/mksc-videos-static.git
$ yarn // this performs install
$ yarn dev // this boots up dev server
```

You are now able to view the application at http://localhost:3000. You can find other commands in package json. Run them with command `yarn run <command>`

## Want to update data in this site?

The SQLite database file is at prisma/database.db. If you want to make any changes to the database; fix times / correct mistakes / add a bunch more, then copy it, use whatever tool you like to make changes, then clone this repo, make a branch, then submit a Pull Request with that file changed. Or just PM me on discord if I'm still active, and I might push the new DB myself.

One way to make minor 1-by-1 tweaks to the db is with the Prisma Studio UI. You can find instructions on how to open that in the tutorial article by Lee Robinson linked at the top of this README.
