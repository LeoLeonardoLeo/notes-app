CHECK "api_routes_readme.md" for api routes and info


Personal Notes App (with encryption)

    Users can create private notes
    Notes are encrypted before being stored
    Option to share notes via expiring links
    Add tags, etc.
    Teaches: encryption, auth, and crud logic

my thoughts:
routes
- auth routes (user login and signup) with jwt, with a get profile (just shows info)
- note routes (allows users who are logged in to create a note, can make it public or private, view notes, get a single note by its id, update note, delete note. EACH NOTE HAS A UNIQUE ID
- share - allows users to share public notes by a link that expires 	

models
- user model - pretty simple and reusable like old projects, admin - can delete notes by id
- note model - have to research but in basic, whatever needs to go in such as private or public, setting each note as a string, etc, also has content, title, tags, isPrivate, tags will be an array of strings in the model so when creating a note allows users to add tags

POST /api/note/create

{
  "title": "I love gambling!!!!",
  "content": "Blackjack is cool, bacarrat, poker, mines all cool",
  "tags": ["#moneymoves", "#gambling", "#blackjack", "#poker"]
}

