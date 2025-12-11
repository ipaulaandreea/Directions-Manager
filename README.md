# Directions-Manager
Ivan Andreea-Paula Tema 15: Manager de trasee integrat cu Google Directions

# Aplicație de tip Carpooling


##  Descriere
### Scop: 
Dezvoltarea unei aplicații care permite utilizatorilor să caute curse disponibile și să se alăture acestora. 
Compatibilitatea între trasee este calculată automat folosind **Google Directions API**, pe baza formei rutei și a abaterii necesare pentru preluarea pasagerului.
### Tech Stack: 
React.js, Express.js, Google Directions API, PostgreSQL, Docker


##  Funcționalități

### Opțiuni pasager
-   Autentificare, autorizare
-   Introducerea traseului dorit
-   Cautarea și selectarea curselor compatibile
-   Realizarea respectiv anularea rezervărilor

###  Calcularea compatibilității traseelor

-   Distanță între traseul șoferului și punctele pasagerului
-   Deviație estimată cu Directions API
-   Verificarea pragului maxDetour

##  Structura proiectului

-   client/ -- React
-   server/ -- Express, Google API, DB

## Endpoint-uri

### Auth
-   `POST auth/login`
-   `POST auth/check`

### Trips
-   `GET /trips`
-   `GET /trips/search`
-   `GET /trips/id`
-   `POST /trips`
-   `PUT /trips/:id`
-   `DELETE /trips/:id`

### Bookings
-  `GET /bookings`
-  `GET /bookings/:id`
-  `POST /bookings`
-  `DELETE /bookings/:id`

### Matches
-   `POST /matches/geocode`
-   `POST /matches/match`

## Instalare

``` bash
docker compose up -d
cd server && npm run seed
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```
