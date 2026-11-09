---
title: "The cost of code you don’t understand"
description: "AI makes software easier to build and extend. Understanding how it works matters more when changes arrive faster, especially when people depend on the result."
date: "2026-11-08"
author: "Royce Mathew"
tags: ["AI", "Software"]
---

I think technical understanding matters more now that we can generate so much code without writing it ourselves. Getting something to work gives us a starting point, but if we intend to keep using it and adding to it, we need to understand what it does well enough to change it. The tools have made that second part easier to skip.

## Getting to working code is easier

Non-technical users can now build useful software for themselves without waiting for a developer. A small tool might clean up a spreadsheet or handle a task they used to do manually. If it does the job and they never need it again, there may be little reason to spend weeks improving its architecture. Disposable software has a place.

The same ease applies to software people will depend on. How much engineering a project needs doesn't come from how hard the code was to produce. It comes from what depends on it and what failure would cost.

## Changes can outpace understanding

A request often arrives as a local change. Someone asks for a button, a report, or a fix to one screen. The change works, the request closes, and the next one arrives. Nothing in that loop requires the person accepting the change to understand how it fits the rest of the system.

The codebase can become a record of requests rather than a system anyone holds in their head. The person who built it may know the parts they touched. Nobody may know the parts that connect them.

In [Speed at the Cost of Quality](https://doi.org/10.1145/3793302.3793349), He and colleagues studied open-source projects that adopted Cursor. Their main analysis estimated an early increase in code output alongside longer-lasting increases in complexity and static-analysis warnings. These tools flag possible problems in code; they do not count production failures. The quality estimates also varied with the statistical method. The study was observational and did not measure how well developers understood the changes.

[Debt Behind the AI Boom](https://arxiv.org/abs/2603.28592), by Liu and colleagues, examined AI-attributed commits across 6,299 repositories. Of the static-analysis findings they tracked, 22.7% remained at the latest revision. Those findings are not necessarily defects people encountered, and the study has no human-only baseline. They do show that accepting a change does not guarantee someone will soon clean up the issues flagged in it.

## What accumulates underneath

Complexity often comes from small pieces of behavior living in more than one place. A permission rule might exist in the interface, which hides a button, and in the API, which rejects the request. Each check seems reasonable where it was added. When the two drift, the screen offers an action the server refuses, and the next change has to find both copies.

State adds another kind of interaction. A record might be written directly at first, and a retry queue added later gives it a second route, so the code has to decide which copy is authoritative. Failure can leave the same split. An upload can finish while the database write that records it fails, leaving storage and the application disagreeing about what happened. If nobody traced that path, the retry behavior is whatever the code happens to do.

None of this is unique to generated code. Human teams accumulate duplicated rules and unclear state too. The tools change the rate. It is easier to add a locally working feature than to update the shared understanding of how the system works.

## How much understanding the work needs

[Kanat-Alexander's talk](https://ai.engineer/talks/bU5gDVyu_28) separates disposable software from durable software by looking at the consequences of failure, the cost of replacing it, who depends on it, and the ongoing cost of maintenance. When those obligations are small, a quick version is reasonable. When they grow, the same code needs more care.

A script that cleans up a copy of a spreadsheet for a one-time analysis can be rerun by hand if it breaks. Nothing downstream depends on it. A tool that holds records that would be hard to reconstruct, moves money, or supports someone's daily work cannot be replaced that casually. Replacing it means preserving the records and the behavior people already rely on.

The depth that matters follows from those obligations. A small internal tool can stay loosely understood if its failure is cheap and its data is replaceable. Software that other work depends on is different. The more a change can break, and the longer those consequences last, the more the person making it needs to know what it touches.

Before extending software other people depend on, I want to answer a few questions. Where does data become permanent, and what reads it afterward? Which rules live in more than one place? What happens when one step succeeds and the next fails? What do the existing checks cover, and what do they miss?

A passing test is evidence, but it covers a narrower set of cases than the system will encounter. In [SpecBench](https://arxiv.org/abs/2605.21384), Zhao and colleagues evaluated coding agents on 30 systems-level tasks. Agents could pass visible tests for individual features and still fail hidden tests that combined those same features. These are benchmark results, not production failure rates, but the gap gives us a concrete reason to check how features work together. A passing suite cannot establish that every combination behaves correctly.

Sufficient understanding means being able to say what this change affects, what could break, how you would notice, and how you would recover. You do not need to explain every line to answer those questions. If the answers are missing, the next feature is a guess about behavior other people depend on.

I would use the model to help trace an affected workflow through the code, then check what happens when a step fails. If its explanation disagrees with the running software, resolve that before extending the workflow.
