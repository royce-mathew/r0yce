---
title: "The cost of code you don’t understand"
description: "AI makes software easier to build and extend. Understanding how it works matters more when changes arrive faster, especially when people depend on the result."
date: "2026-11-08"
author: "Royce Mathew"
tags: ["AI", "Software"]
---

I think understanding code really matters, more than it ever did before. We can now generate a lot of code without having to write every line ourselves, and getting an application running now takes far less time than it once did. But if we plan to build on that code and keep it reliable, we still need to know what it does well enough to change it.

## Getting to working code is easier

Some code gets built on and maintained, and a lot of times it doesn't. A non-technical user can very easily build a small tool to clean up a spreadsheet without requiring a developer. You can generate a few lines for a Neovim config that change a setting you will not revisit. Neither needs much engineering, and neither costs much to get wrong: you can ask for the tool again, and you can change the setting back. Nothing else depends on it, so nobody really needs to understand it.

On the other hand, software that other people depend on isn't as disposable. How much engineering a project needs doesn't come from how hard the code was to produce, but it comes from **what depends on it and what its failure could cost**. That's what decides how much of it you need to understand.

## Changes can outpace understanding

A request from users often arrives as a local change. Someone asks for a button, a report, or a fix to one screen. The change works, the request closes, and the next one arrives. Nothing in that loop requires the person accepting the change to understand how it fits the rest of the system.

The codebase can become more of a record of requests rather than a system that anyone holds in their head. The person who built it may know the parts they touched but ***nobody*** knows the parts that connect them.

In [Speed at the Cost of Quality](https://doi.org/10.1145/3793302.3793349), He et al. studied open-source projects that adopted Cursor. Their main analysis estimated an early increase in code output alongside longer-lasting increases in complexity and static-analysis warnings. These tools flagged possible problems in code; they don't count actual production failures. The quality estimates also varied with the statistical method. Something to note here is that the study was observational and didn't measure how well developers understood the changes.

[Debt Behind the AI Boom](https://arxiv.org/abs/2603.28592), by Liu et al., examined AI-attributed commits across 6,299 repositories. Of the static-analysis findings they tracked, 22.7% remained at the latest revision. Those findings are not necessarily defects people encountered, and the study has no human-only baseline. They do show that accepting a change does not guarantee someone will soon clean up the issues flagged in it.

## Accumulation

Complexity can often come from small pieces of behavior living in more than one place. For example, a permission rule might exist in the interface, which hides a button, and in the API, which rejects the request. Each check seems reasonable where it was added. When the two drift, the screen offers an action the server refuses, and the next change has to find both copies.

State adds another kind of interaction. A record might be written directly at first, and a retry queue added later gives it a second route, so the code has to decide which copy is authoritative. Failure can leave the same split. An upload can finish while the database write that records it fails, leaving storage and the application disagreeing about what happened. If nobody traced that path, the retry behavior is basically whatever the code happens to do.

None of this is unique to generated code, human teams accumulate duplicated rules and unclear state too. The tools change the rate. It is much easier to add a locally working feature than to update the shared understanding of how the system works.

## How much understanding the work needs

[Kanat-Alexander's talk](https://ai.engineer/talks/bU5gDVyu_28) separates disposable software from durable software by looking at the consequences of failure, the cost of replacing it, who depends on it, and the ongoing cost of maintenance. When those obligations are small, a quick version is reasonable. When they grow, the same code needs more care.

A script that cleans up a copy of a spreadsheet for a one-time analysis can be rerun by hand if it breaks. Nothing downstream depends on it. A tool that holds records that would be hard to reconstruct, moves money, or supports someone's daily work cannot be replaced that casually. Replacing it also means preserving the records and the behavior people already rely on.

How well you need to understand the code depends on who relies on it and what failure would cost. A small internal tool can stay loosely understood if its failure is cheap and its data is replaceable. Software that other work depends on is different. The more a change can break, and the longer those consequences last, the more the person making it needs to know what it touches.

Before extending software other people depend on, I want to answer a few questions. Where does data become permanent, and what reads it afterward? Which rules live in more than one place? What happens when one step succeeds and the next fails? What do the existing checks cover, and what do they miss?

A passing test is evidence, but it covers a narrower set of cases than the system will encounter. In [SpecBench](https://arxiv.org/abs/2605.21384), Zhao and colleagues evaluated coding agents on 30 systems-level tasks. Agents could pass visible tests for individual features and still fail hidden tests that combined those same features. These are benchmark results, not production failure rates, but the gap gives us a concrete reason to check how features work together. A passing suite cannot establish that every combination behaves correctly.

Sufficient understanding means being able to say **what this change affects, what could break, how you would notice, and how you would recover**. You do not need to explain every line to answer those questions. If the answers are missing, the next feature is a guess about behavior other people depend on.

I would use the model to help trace an affected workflow through the code, then check what happens when a step fails. If its explanation disagrees with the running software, resolve that before extending the workflow.
