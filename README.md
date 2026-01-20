# Directions-Manager
Ivan Andreea-Paula Tema 15: Manager de trasee integrat cu Google Directions
- Video Demo: https://drive.google.com/file/d/1oxcmp5vmutqO0o_HIMdjxMqMV4Sid2pN/view?usp=sharing

# Aplicație de tip Carpooling


##  Descriere

Directions Manager are ca scop conectarea eficientă a șoferilor și pasagerilor care au trasee compatibile. Compatibilitatea este calculată automat folosind Google Directions API și Google Geocoding API, analizând forma reală a traseelor și abaterile necesare pentru preluarea pasagerilor.
### Tech Stack: 
- React.js
- Express.js
- Google Directions API
- Google Geocoding API
- PostgreSQL
- Docker


##  Funcționalități

### Opțiuni pasager
-   Autentificare și autorizare (JWT)
-   Introducerea adresei de preluare și a destinației
-   Căutarea curselor compatibile
-	Vizualizarea detaliilor unei curse
-	Crearea și anularea rezervărilor

### Opțiuni șofer
-   Crearea, editarea și ștergerea propriilor curse

###  Calcularea compatibilității traseelor

-   Calcularea distanței dintre:
	  • punctul de preluare al pasagerului și originea cursei
	  • destinația pasagerului și destinația cursei
-   Filtrarea curselor în funcție de:
	  -	maxPickupDistance
	  - maxDestinationDistance
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
1. docker compose up -d
2. open DB connection with DB client of choice
3. cd server && npm install
4. cd server && npm run seed
5. cd server && npm run dev
6. cd client && npm install 
7. cd client && npm run dev
```

## Demo Account

⚠️ For demo/testing purposes only, log in with the following credentials:

- Email: paula@example.com
- Password: password1

This account exists only in the demo environment and contains no real data.

