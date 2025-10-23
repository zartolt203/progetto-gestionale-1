# Gestionale Plant


## Descrizione

Applicazione web per gestione oggetti in magazzini:
- Monitoraggio (collo, codice, matricola, descrizione, quantità, locazione)
- Apertura precompilata di email per richieste trasferimento


## Funzionalità

Non sono previsti ruoli, ma solamente una protezione tramite autenticazione.

- **Utente non loggato**
    - visualizzare e ricercare
- **Utente loggato**
    - visualizzare e ricercare
    - aggiungere/eliminare/modificare colli
    - aggiungere/eliminare foto per ogni collo
    - precompilare email per richieste trasferimento tra i magazzini magazzino1 e magazzino2


## Tecnologie
- **Backend**: Python, Flask
- **ORM**: SQLAlchemy + Flask-Migrate
- **Database**: MySQL (in Docker)
- **Frontend**: HTML, CSS, JavaScript
- **Container**: Docker + Docker Compose

## Struttura del progetto
```text
progetto-gestionale-1/
|-- app/
|   |-- routes/
|   |-- __init__.py
|   |-- models.py
|   |-- static/
|   |   |-- css/
|   |   |-- js/
|   |   |-- img/
|   |   |-- uploads/colli/
|   |-- templates/
|-- migrations/  
|-- requirements.txt
|-- docker-compose.yml
|-- .env 
|-- run.py
|-- README.md
```

## Installazione


## Prerequisiti 

- Python 3.9+
- Git
- Docker + Docker Compose

---


## 1. Clona il repository

```bash
git clone https://github.com/zartolt203/progetto-gestionale-1.git
cd progetto-gestionale-1
```

## 2. Creazione file .env nella root di progetto con variabili sensibili

```bash
# Credenziali MySQL per il container
MYSQL_ROOT_PASSWORD=change-me
MYSQL_DATABASE=gestionale_plant
MYSQL_USER=appuser
MYSQL_PASSWORD=change-me

# Variabili per flask
DATABASE_URL=mysql+mysqlconnector://appuser:change-me@localhost:3306/gestionale_plant
SECRET_KEY=change-me
ADMIN_PASSWORD=change-me
```

## 3. Avvio database tramite docker

```bash
docker compose up -d
```

## 4. Creazione e attivazione ambiente virtuale

```bash
python -m venv venv

  # Windows PowerShell:
  venv/Scripts/Activate.ps1

  # Linux
  source venv/bin/activate
  ```

## 5. Installazione dipendenze

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 6. Configurazione variabili d'ambiente in config.py

```bash
    # --- Security ---
    SECRET_KEY = "EXAMPLE"
    # --- Admin Password ---
    ADMIN_PASSWORD = "EXAMPLE"
```

## 7. Al primo avvio verranno create le tabelle nel database e il percorso app/static/uploads/colli/
Nel file: __init__.py alle righe: 29-30 and 47-48-49

## 8. Avvio app tramite script entry-point

```bash
python run.py
```