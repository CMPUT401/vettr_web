import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	session: Ember.inject.service(),
	ajax: Ember.inject.service(),
	model(param){
		var self = this;
		clearFields(self);//clear the entryfields before setting them
		//ajax get request to populate field
		var ajaxGet = new Ember.RSVP.Promise((resolve) =>
		this.get('ajax').request('/api/client/' + param.clientID
			).then(function(data){
				Ember.run(function() {
				resolve({
					firstName: deserialAttribute(data.client.firstName),
					lastName: deserialAttribute(data.client.lastName),
					phoneNumber: deserialAttribute(data.client.phoneNumber),
					email: deserialAttribute(data.client.email),
					addressLine1: deserialAttribute(data.client.addressLine1),
					addressLine2: deserialAttribute(data.client.addressLine2),
					addressLine3: deserialAttribute(data.client.addressLine3),

					licos: deserialAttribute(data.client.licos),
					aish: deserialAttribute(data.client).aish,
					socialAssistance: deserialAttribute(data.client.socialAssistance),
					
					created_at: deserialCreateAt(data.client),
					updated_at: deserialUpdatedAt(data.client),
					notes: deserialNotes(data.client),

					alternativeContactFirstName: deserialAttribute(data.client.alternativeContactFirstName),
					alternativeContactLastName: deserialAttribute(data.client.alternativeContactLastName),
					alternativeContactPhoneNumber: deserialAttribute(data.client.alternativeContactPhoneNumber),
					alternativeContact2ndPhone: deserialAttribute(data.client.alternativeContact2ndPhone),
					alternativeContactAddress: deserialAltAddress(data.client.alternativeContactAddressLine1),
					alternativeContactEmail: deserialAttribute(data.client.alternativeContactEmail),

					clientID: deserialAttribute(data.client.id),
					patients: deserialPatients(data.client.patients)
				});
			  });
			
			},
			function(data){
				if (data === false){
					if (self.get('session.isAuthenticated')){
					self.get('session').invalidate();
					}
				self.transitionTo('/login');
				}
		}));
		return ajaxGet;
	}
});


function clearFields(page){
	page.set('clientFirstName', '');
	page.set('clientLastName', '');
	page.set('clientAddress', '');
	page.set('clientPhone', '');
	page.set('clientEmail', '');
	page.set('clientLICO', '');
	page.set('clientAISH', '');
	page.set('clientAS', '');
	page.set('alternativeFirstName', '');
	page.set('alternativeLastName', '');
	page.set('alternativePrimaryPhone', '');
	page.set('alternativeAddress', '');
	page.set('clientNotes', '');
	page.set('alternativeSecondaryPhone', '');
	page.set('alternativeEmail', '');
}

function deserialPatients(patients){
	var deserial = [];
	for(var i = 0; i < patients.length; i++) {
		var patient = patients[i];
		patient.id = JSON.stringify(patients[i].id).replace(/\"/g, "");
		patient.firstName = JSON.stringify(patients[i].first_name).replace(/\"/g, "");
		patient.lastName = JSON.stringify(patients[i].last_name).replace(/\"/g, "");
		
		deserial.push(patient);

	}
	return(deserial);
}

function deserialAttribute(attribute){
	if(attribute != null){
		return JSON.stringify(attribute).replace(/\"/g, "");
	}else{
		return "";
	}
}


function deserialCreateAt(client){
	var createdAt = client.created_at;
	if(createdAt != null){
		return JSON.stringify(createdAt).replace(/\"/g, "").slice(0,10);
	} else{
		return "";
	}
}

function deserialUpdatedAt(client){
	var updatedAt = client.updated_at;
	if(updatedAt != null){
		return JSON.stringify(updatedAt).replace(/\"/g, "").slice(0,10);
	} else{
		return "";
	}
}

function deserialNotes(client){
	var notes = client.notes;
	if(notes != null){
		return JSON.stringify(notes).replace(/\\n/g, " <br> " ).replace(/\"/g, "");
	} else{
		return "";
	}
}

function deserialAltAddress(client){
	var altAddress = client.alternativeContactAddress;
	if(altAddress != null){
		return JSON.stringify(altAddress).replace(/\\n/g, " <br> " ).replace(/\"/g, "");
	} else{
		return "";
	}
}


