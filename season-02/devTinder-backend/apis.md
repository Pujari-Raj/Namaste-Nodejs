# DevTinder API's

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter 
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password (forgot-password)

# connectRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

# userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you profiles of all other users on platform (/recs - reference from tinder)

CONNECTION STATUS - IGNORED, INTERESTED, ACCEPTED, REJECTED

# from my understanding

- GET /macthes
- GET /messages