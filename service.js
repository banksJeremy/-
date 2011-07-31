var highLevelYo = new (require("./sqlite-high-level.js").Database);
var Deferred = require("jquery").Deferred;

Service = {

    sync: function (user_id, fromRevision, updates) {
        var result = new Deferred;
        
        highLevelYo.getLatestRevision(user_id).then(function(serverRevision) {
			var updates = {head: 200, body: {}};
			
			if (fromRevision < serverRevision) {
				highLevelYo.getUpdatesFrom(user_id, fromRevision).then(function(update_data) {
					updates.body = update_data;
					result.resolve(updates);
				});
			} else if (fromRevision == serverRevision) {
				highLevelYo.postUpdates(user_id, updates).then(function() {
					result.resolve(updates);
				});
			} else {
				updates.head = 400;
				result.resolve(updates);
			}
        	
        });
        
        return result;
    }
    
}

if (module) module.exports = Service;
