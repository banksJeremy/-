Service = {

    sync: function (user_id, fromRevision, updates) {
        
        var updates = {head: 200, body: {}};
        
        var serverRevision = getLatestRevision(user_id);
        if (fromRevision < serverRevision) {
            updates.body = getUpdatesFrom(user_id, fromRevision);
        } else if (fromRevision == serverRevision) {
            postUpdates(user_id, updates);
        } else {
            updates.head = 400;
        }
    }
    
}

if (exports) exports = Service;