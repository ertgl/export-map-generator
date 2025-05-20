#!/usr/bin/env node

import { runCLI } from "../cli";

async function main(): Promise<void>
{
  await runCLI(process.argv);
}

void main();
