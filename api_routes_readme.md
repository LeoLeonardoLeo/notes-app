api routes

all of these expect for login and signup need JWT as theyre all account based

Key                 Value
Authorization       Bearer xxxxxxxxxxxx


signup
POST http://localhost:3001/api/auth/signup
{
    "username": "first test",
    "email": "firsttest@email.com",
    "password": "firsttest"
}

POST login
{
    "email": "firsttest@email.com",
    "password": "firsttest"
}

BOTH give a token
use that token for these 

Note routes
create note
POST http://localhost:3001/api/notes/create-note
{
    "note_title": "Poop",
    "note_text": "poop",
    "note_privacy": "private",
    "tags": ["#poop"]    //"tags": ["word1", "word2", "etc"]
}

get all notes
GET http://localhost:3001/api/notes/all-notes

get note by title, not case sensitive, and partial results
GET http://localhost:3001/api/notes/note/xxxxxx 

update note (by id)
PUT http://localhost:3001/api/notes/update-note/xxxxxxx
{
    "note_title": "My FIRST note after mass delete - UPDATED",
    "note_text": "this is update note text, used to be private its now public",
    "note_privacy": "public",
    "tags": ["#updated", "brandnewnote"]
}

delete note (by id)
DELETE http://localhost:3001/api/notes/delete-note/xxxxxxxxxxx


sharing notes - must be public to share
still need token for these
POST http://localhost:3001/api/share/share-note/NOTE ID HERE (that you want to share)
{
    "expiresIn": "1"  //could be 1, 2, etc 
}

OUTPUT
{
    "shareUrl": "http://localhost:3001/api/share/shared-note/d57176c20f278b7647056a8bfc6c6ae5",
    "expiresAt": "2025-09-02T00:57:50.275Z"
}

getting note - dont need jwt (dont need to be logged in)
in the route above you should get a link (above is an example output of a link, directly use it and we get info)
http://localhost:3001/api/share/shared-note/d57176c20f278b7647056a8bfc6c6ae5 

OUTPUT 
{
    "note_title": "My FIRST note after mass delete - UPDATED",
    "note_text": "this is update note text, used to be private its now public",
    "tags": [
        "#updated",
        "brandnewnote"
    ]
}
