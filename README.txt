I totally forgot about the typescript requirement hope you will accept it regardless

To start 

-- git clone 
-- npm install

Change Mongo url to yours for testing
-- npm start

To test registration -> http://127.0.0.1:5000/user/registration POST

{
  "name": "John Doe",
  "role": "user",
  "email": "youremail@gmail.com",  // use real email as system sends activation link 
  "password": "strongpassword"
}

Then you go to mail find list, and click activate (do not forget to check spam) ->

To test login -> http://127.0.0.1:5000/user/login POST

{
  "email": "youremail@gmail.com",
  "password": "strongpassword"
}

To test logout -> http://127.0.0.1:5000/user/logout POST

{

}

To test get all users -> http://127.0.0.1:5000/user/get-all GET

{

}

HEADERS: Bearer and accessToken of your user otherwise you will get 401 Unauthorized

To test get user by id users -> http://127.0.0.1:5000/user/get-user GET

{
	"userId": "664f7aa4423120a80f3603f9"
}

HEADERS: Bearer and accessToken of your user otherwise you will get 401 Unauthorized

To test change user data -> http://127.0.0.1:5000/user/change-user-data POST

{ 
	"oldEmail": "youremail@gmail.com", 
	"oldPassword": "strongpassword", 
	"name": "newName", 
	"role": "admin", // admin or user
	"email": "newemail@gmail.com", // you will need to activate it again 
	"password": "newPassword"
}

To test refresh -> http://127.0.0.1:5000/user/refresh GET

COOKIES:
  	refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiYWRyaWFuLmZhcnluaXVrLndvcmtAZ21haWwuY29tIiwiaWQiOiI2NjRmNmY1MmFlNmU3YjhmYjk3ZmJhMTMiLCJpc0FjdGl2YXRlZCI6ZmFsc2UsImlhdCI6MTcxNjQ4MTg3NSwiZXhwIjoxNzE5MDczODc1fQ.OBNzaTRSABrGKBQM_oS_P-Jidz_EhqmJBZyyJ-p3-Vk;

    // you will need to put user refreshToken to get new accessToken 

To test post add -> http://127.0.0.1:5000/post/add POST

{ 
	"title": "My first post", 
	"text": "Gigidibababu", 
	"foreignKey": "664f52318994b70f2eb8df37" // id of owner 
}

HEADERS: Bearer and accessToken of your user otherwise you will get 401 Unauthorized

// NOTE: system checks whether foreignKey is an owner of accessToken

To test delete post http://127.0.0.1:5000/post/delete -> 

{ 
	"postId": "664f9182f2a61078ead68674",
	"foreignKey": "664f7aa4423120a80f3603f9"
}

HEADERS: Bearer and accessToken of your user otherwise you will get 401 Unauthorized

To test get all posts -> http://127.0.0.1:5000/post/get-all GET

{
  
}

HEADERS: Bearer and accessToken of your user otherwise you will get 401 Unauthorized

To test get user posts -> http://127.0.0.1:5000/post/get-user-posts GET

{
	"userId": "664f7aa4423120a80f3603f9"
}

HEADERS: Bearer and accessToken of your user otherwise you will get 401 Unauthorized
