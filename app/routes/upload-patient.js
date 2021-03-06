import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	init(){
		checkFileApiSupport();
		//document.getElementById('files').addEventListener('change', handleFileSelect, false);
		//console.log(document.getElementById('files'));
	},
	model(param){
		return {
			patientId: param.patientID
		};
	}
});

function checkFileApiSupport(){
	if (window.File && window.FileReader && window.FileList && window.Blob){
		return true;
	} else{
		alert("The File APIs are not fully supported in this browser. ");
		return false;
	}
}
