/* global App */

App.User = (function(Api) {
	
	function User(username, hash) {
		this.username = username;
		this.hash = hash;
	}
	// Will use cookies
	var currentUser = new User("jack","mdw32n3j2knjkn");
	
	User.getUser = function(id) {
		if (typeof id === 'undefined') {
			// check cookie
			// look up in db
			return currentUser;
		} else {
			// look up in db
			return currentUser;
		}
	};
	
	/**
	 * Example use
	 * var newUser = User.create({
	 * 		username: "x",
	 * 		email: ""
	 * });
	 * 
	 * newUser.save({
	 * 		onTaken: handleUserTaken,
	 * 		onCreated: handleUserCreated 
	 * });
	 * 
	 */
	User.create = function() {
	}
	
	// Optimise creating an array of users
	User.getUsers = function() {
	}
	
	User.prototype.setDataBasedOnId = function() {
		this.username = "Jack";
		this.hash = "mdw32n3j2knjkn";
	}
	
	// Methods
	// delete
	// update
	// save
	return User;
})(App.api);