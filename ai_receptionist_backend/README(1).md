# Voice Receptionist

An AI-powered voice receptionist prototype with a Python backend and a
React/TypeScript frontend. The system is designed to provide a
conversational interface for handling receptionist-style interactions
through an AI-assisted workflow.

## Overview

The project contains two main application layers:

-   **Backend** --- Python-based application containing the core logic,
    database layer, models, CRUD operations, and simulation
    functionality.
-   **Frontend** --- React + TypeScript application built with Vite for
    the user interface.

The architecture is intended to keep the frontend and backend modular so
that additional receptionist capabilities can be added without
restructuring the entire application.

## Key Features

-   AI-assisted conversational interaction
-   Voice-assistant/receptionist workflow
-   Python backend
-   React + TypeScript frontend
-   Database integration
-   CRUD operations
-   Structured data models
-   Simulation environment for testing receptionist workflows
-   Modular frontend components
-   API-oriented backend architecture

## Project Structure

``` text
PB/
│
├── ai_receptionist_backend/
│   ├── ai_receptionist_simulation.py
│   ├── CRUD.py
│   ├── database.py
│   ├── main.py
│   └── models.py
│
├── Frontend/
│   ├── src/
│   │   ├── imports/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .figma/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
├── package.json
└── package-lock.json
```

## Technology Stack

### Backend

-   Python
-   REST/API architecture
-   Database layer
-   CRUD operations
-   Data models

### Frontend

-   React
-   TypeScript
-   Vite
-   CSS
-   Node.js package ecosystem

### Development Tools

-   Git
-   GitHub
-   Figma
-   npm / pnpm

## Architecture

``` text
                  ┌──────────────────────┐
                  │       User           │
                  │  Voice / Interface   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │      Frontend        │
                  │ React + TypeScript   │
                  │       + Vite         │
                  └──────────┬───────────┘
                             │
                         API Requests
                             │
                             ▼
                  ┌──────────────────────┐
                  │       Backend        │
                  │       Python         │
                  ├──────────────────────┤
                  │ Application Logic    │
                  │ CRUD Operations      │
                  │ Models               │
                  │ Database Layer       │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │       Database       │
                  └──────────────────────┘
```

## Backend Components

### `main.py`

Main backend entry point and API configuration.

### `database.py`

Contains database configuration and database-related functionality.

### `models.py`

Defines the application's data models.

### `CRUD.py`

Contains Create, Read, Update, and Delete operations used by the
backend.

### `ai_receptionist_simulation.py`

Provides a simulation environment for testing the AI receptionist
workflow.

## Frontend

The frontend is built using React and TypeScript with Vite.

The main application entry points are:

-   `src/App.tsx` --- Main application component
-   `src/main.tsx` --- Frontend entry point
-   `src/index.css` --- Global styling
-   `src/imports/` --- Imported frontend resources/components

## Prerequisites

Install the following before running the project:

-   Python 3.10 or newer
-   Node.js
-   npm or pnpm
-   Git

## Installation

### 1. Clone the repository

``` bash
git clone https://github.com/ISHANK-1503/Voice-receptionist.git
cd Voice-receptionist
```

### 2. Set up the Python backend

Create a virtual environment:

``` powershell
python -m venv venv
```

Activate it on Windows PowerShell:

``` powershell
.\venv\Scripts\Activate.ps1
```

Install backend dependencies if a `requirements.txt` file is provided:

``` powershell
pip install -r requirements.txt
```

### 3. Install frontend dependencies

Navigate to the frontend:

``` powershell
cd Frontend
```

Using npm:

``` powershell
npm install
```

Or using pnpm:

``` powershell
pnpm install
```

## Running the Project

### Backend

From the backend directory:

``` powershell
cd ai_receptionist_backend
```

If `main.py` exposes a FastAPI application named `app`, run:

``` powershell
uvicorn main:app --reload
```

Otherwise, run the project's configured Python entry point:

``` powershell
python main.py
```

### Frontend

Open a separate terminal and run:

``` powershell
cd Frontend
npm run dev
```

Or:

``` powershell
pnpm dev
```

Vite will display the local development URL in the terminal.

## Environment Variables and Secrets

**Never commit API keys, passwords, access tokens, or other secrets to
GitHub.**

If the application requires an API key, store it in an environment
variable or a local `.env` file.

Example:

``` env
OPENAI_API_KEY=your_api_key_here
```

Ensure `.env` is included in `.gitignore`.

If a secret has already been committed, remove it from Git history and
rotate/revoke the exposed credential before pushing the repository.

## Development

A typical development workflow is:

``` text
Modify Code
     │
     ▼
Run Backend
     │
     ▼
Run Frontend
     │
     ▼
Test Interaction
     │
     ▼
Review Changes
     │
     ▼
Git Commit
     │
     ▼
Git Push
```

## Future Enhancements

Possible extensions for the voice receptionist include:

-   Speech-to-text integration
-   Text-to-speech responses
-   Appointment scheduling
-   Customer/patient information lookup
-   FAQ and knowledge-base integration
-   Conversation history
-   AI-powered intent detection
-   Call routing and escalation
-   Human-agent handoff
-   Authentication and authorization
-   Logging and monitoring
-   Docker-based deployment
-   Production database integration
-   Multi-language support

## Security Considerations

For production deployment, the system should include:

-   Secure API-key management
-   Authentication and authorization
-   Input validation
-   Rate limiting
-   Secure database access
-   HTTPS
-   Audit logging
-   Protection of personally identifiable information
-   Proper access controls between users and administrative functions

## Project Status

**Prototype / Development**

The current repository provides the foundation for an AI-assisted voice
receptionist and can be extended with additional voice, AI, database,
and business workflow capabilities.

## Author

**Ishank Singh**

GitHub: [ISHANK-1503](https://github.com/ISHANK-1503)
