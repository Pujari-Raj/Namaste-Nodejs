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
below both api can be done in 1 API using dynamic(interested/ignored)
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
below both api can be done in 1 API using dynamic(accepted/rejected)

for above api
steps - /request/review/:status/:requestId

1. get values of status, requestId from params
2. allowedStatusType (accepted/rejected)
3. If user is loggedIn
4. requestId should be of Id(of connectionRequest id) to whom the request was sent to 
5. does connectionRequest exist

- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

# userRouter
- GET /user/requests
 - API to get all the connection request that user gets
- GET /user/connections
- GET /user/feed - Gets you profiles of all other users on platform (/recs - reference from tinder)

CONNECTION STATUS - IGNORED, INTERESTED, ACCEPTED, REJECTED

# from my understanding

- GET /macthes
- GET /messages