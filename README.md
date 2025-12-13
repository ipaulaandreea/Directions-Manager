# Directions-Manager
Ivan Andreea-Paula Tema 15: Manager de trasee integrat cu Google Directions

# Aplicație de tip Carpooling


##  Descriere
### Scop: 
Dezvoltarea unei aplicații care permite utilizatorilor să caute curse disponibile și să se alăture acestora. 
Compatibilitatea între trasee este calculată automat folosind **Google Directions API**, pe baza formei rutei și a abaterii necesare pentru preluarea pasagerului.
### Tech Stack: 
React.js, Express.js, Google Directions API, Google Geocoding API, PostgreSQL, Docker


##  Funcționalități

### Opțiuni pasager
-   Autentificare și autorizare (JWT)
-   Introducerea adresei de preluare și a destinației
-   Căutarea curselor compatibile (match)
-	Vizualizarea detaliilor unei curse
-	Crearea și anularea rezervărilor (bookings)

### Opțiuni șofer
-   Crearea, editarea și ștergerea propriilor curse
-	Vizualizarea rezervărilor asociate curselor
-	Gestionarea locurilor disponibile

###  Calcularea compatibilității traseelor

-   Calcularea distanței dintre:
	  • punctul de preluare al pasagerului și originea cursei
	  • destinația pasagerului și destinația cursei
-   Filtrarea curselor în funcție de:
	  •	maxPickupDistance
	  •	maxDestinationDistance
-   Sortarea rezultatelor crescător după distanța de preluare

##  Structura proiectului

-   client/ -- React
-   server/ -- Express, Google API, DB

## Endpoint-uri

### Auth
-   `POST /auth/login`
-   `POST /auth/check`

### Users
-   `GET /users/me`

### Trips
-   `GET /trips`
-   `GET /trips/search`
-   `GET /trips/:id`
-   `POST /trips`
-   `PUT /trips/:id`
-   `DELETE /trips/:id`

### Bookings
-  `GET /bookings`
-  `GET /bookings/:id`
-  `POST /bookings`
-  `PATCH /bookings/:id/cancel`
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
