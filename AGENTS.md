<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
# AGENT.md

# TicketFox

Version: 1.0

Status: Active Development

---

# Project Overview

TicketFox is a structured knowledge operating system for IT support technicians.

The primary objective is to capture, organize, retrieve, and continuously improve troubleshooting knowledge collected from real-world IT support work.

TicketFox starts as a knowledge management platform and progressively evolves into an AI-powered IT Support Copilot through Retrieval Augmented Generation (RAG), MCP integrations, and agent-based workflows.

The project is intentionally built in phases.

AI is not the foundation.

Knowledge is the foundation.

---

# Core Philosophy

Every incident is knowledge.

Every knowledge entry should be:

* Structured
* Searchable
* Reusable
* Expandable
* AI-ready

The system should prioritize:

1. Knowledge capture
2. Knowledge organization
3. Knowledge retrieval
4. Knowledge augmentation
5. Knowledge automation

Never build AI features before sufficient knowledge exists.

The knowledge base is the product.

AI is an enhancement layer.

---

# Product Vision

TicketFox should eventually become an IT Support Operating System capable of:

* Incident documentation
* Troubleshooting workflows
* Knowledge management
* Documentation management
* Resource organization
* AI-assisted search
* AI-assisted incident resolution
* MCP tool integrations
* Internal support copilots
* English support coaching
* Technician training
* Knowledge analytics

The long-term goal is to create a system that becomes more valuable with every incident documented.

---

# Mascot

Name:

Fox

Species:

Minimal geometric fox

Purpose:

Represents:

* Intelligence
* Adaptability
* Fast problem solving
* Investigation
* Technical reasoning

Design rules:

* Flat design
* Minimal
* Geometric
* Professional
* Not cartoonish
* No childish appearance

Primary colors:

Fox Orange:
#F97316

Charcoal:
#111827

Off White:
#F9FAFB

The fox should appear:

* Empty states
* Onboarding screens
* Branding assets
* Marketing materials

Never overuse the mascot.

TicketFox is a professional tool.

The fox is a supporting brand element.

---

# Product Positioning

TicketFox is not:

* A ticketing system
* A chatbot
* A generic AI assistant

TicketFox is:

A structured IT knowledge operating system.

The knowledge base is the source of truth.

---

# Target Users

Primary:

* IT Support Technicians
* Help Desk Agents
* Service Desk Analysts

Secondary:

* System Administrators
* MSP Teams
* Internal IT Departments

Future:

* Engineering Teams
* DevOps Teams
* Technical Support Teams

---

# Technology Stack

Frontend

* Next.js 15
* TypeScript
* TailwindCSS
* shadcn/ui
* Lucide Icons

Backend

* Next.js Server Actions
* Prisma ORM
* PostgreSQL

Authentication

* Clerk

Storage

Phase 1:

* Local storage

Future:

* Cloudflare R2

Deployment

* Vercel

---

# Design System

TicketFox follows a documentation-first interface inspired by:

* Notion
* Linear
* Hashbrown
* Stripe Documentation

Characteristics:

* Warm neutral background
* Strong typography
* Left-aligned content
* Calm visual hierarchy
* Minimal animations
* Developer-first UX

The design system lives in:

DESIGN.md

All UI implementations must follow DESIGN.md.

---

# Development Rules

Always favor:

* Simplicity
* Readability
* Extensibility

Avoid:

* Premature optimization
* Overengineering
* Unnecessary abstractions

Build the smallest working version first.

---

# Architecture

Knowledge
-> Blocks
-> Tags
-> Categories
-> Files

Future AI systems consume knowledge.

Knowledge does not depend on AI.

AI depends on knowledge.

---

# Core Entity

Knowledge

Everything is knowledge.

Examples:

* Incident
* Documentation
* Resource
* Note
* Checklist
* Script

All knowledge types use the same core architecture.

---

# Knowledge Types

INCIDENT

Real support issue.

DOCUMENTATION

Reference material.

RESOURCE

External resource.

NOTE

Quick knowledge capture.

CHECKLIST

Procedural workflow.

SCRIPT

Command or automation snippet.

---

# Block-Based Editor

Knowledge is composed of blocks.

Knowledge never stores a giant text blob.

Knowledge stores structured blocks.

---

# Block Types

Phase 1

* HEADING
* PARAGRAPH
* STEP
* IMAGE

Future

* CHECKLIST
* WARNING
* CODE
* TABLE
* CALLOUT
* QUOTE
* EMBED
* FILE_REFERENCE

Every block must be:

* Independent
* Reorderable
* Searchable
* AI-retrievable

---

# Phase 1

Knowledge Operating System

Goal:

Build the knowledge foundation.

Features:

* Authentication
* Knowledge CRUD
* Categories
* Tags
* Files
* Block editor
* Search
* Dashboard

No AI.

No embeddings.

No agents.

No MCP.

---

# Phase 2

AI Search

Goal:

Improve retrieval.

Features:

* Semantic search
* Knowledge summarization
* Similar incident suggestions

Technology:

* OpenAI
* Vercel AI SDK
* pgvector

---

# Phase 3

RAG

Goal:

Ground AI responses using stored knowledge.

Pipeline:

User Query
-> Retrieval
-> Context Construction
-> LLM
-> Response

Sources:

* Knowledge entries
* Documentation
* Resources
* Files

---

# Phase 4

MCP Integration

Goal:

Expose TicketFox as an MCP server.

Tools:

searchKnowledge()

getKnowledge()

searchIncidents()

searchDocumentation()

searchResources()

createKnowledge()

updateKnowledge()

Future MCP clients:

* ChatGPT
* Claude Desktop
* Cursor
* Antigravity IDE

---

# Phase 5

Agent Layer

Technology:

* LangGraph

Purpose:

Create multi-step reasoning workflows.

Example:

User asks VPN question

Router
-> Incident Search
-> Documentation Search
-> Resource Search
-> Generate Response

Agents should never hallucinate solutions.

Knowledge retrieval must occur before generation.

---

# Phase 6

English Support Coach

Purpose:

Help technicians communicate professionally.

Features:

* IT vocabulary
* Troubleshooting phrases
* Roleplay conversations
* Ticket writing assistance

Future:

Call simulation workflows.

---

# Phase 7

Document Processing

Supported Files:

* PDF
* DOCX
* TXT
* Markdown

Pipeline:

Upload
-> Extract
-> Chunk
-> Embed
-> Store

Tools:

* LangChain
* Unstructured
* OpenAI Embeddings

---

# Search Strategy

Phase 1

PostgreSQL Full Text Search

Phase 2

Hybrid Search

* Full Text Search
* Vector Search

Future

Hybrid Retrieval Ranking

---

# Data Ownership

The knowledge base is the primary asset.

Every architecture decision should prioritize:

* Data quality
* Data structure
* Retrieval quality

Before adding features ask:

Does this improve knowledge capture?

Does this improve knowledge retrieval?

If the answer is no, reconsider the feature.

---

# User Experience Principles

The editor should feel:

* Fast
* Invisible
* Frictionless

Knowledge capture should be faster than writing in Word.

Retrieval should be faster than searching Google.

---

# Success Metrics

Phase 1 Success:

100+ real knowledge entries.

Phase 2 Success:

Semantic search finds useful results.

Phase 3 Success:

AI can answer based on stored knowledge.

Phase 4 Success:

External agents can query TicketFox through MCP.

Phase 5 Success:

AI assists technicians during real troubleshooting sessions.

---

# Final Principle

TicketFox exists to transform experience into reusable knowledge.

Every solved problem should make the system smarter.

Knowledge first.

AI second.

Structure before automation.

Capture before generation.

<!-- END:nextjs-agent-rules -->
