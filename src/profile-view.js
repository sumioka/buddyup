import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import handleImage from './util/ImageHandler.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

class ProfileView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        .camera {
            position: absolute;
            left: 1.5em;
            bottom: 0;
        }
        .display {
            display: flex;
            justify-content: space-between;
        }
        .displayName {
            width: 20em;
            margin-left: 1em;
        }
        .file {
          display: none;
        }
        .on {
            float: right;
            margin-top: 1em;
        }
        .photo {
            position: relative;
        }
        </style>

        <div class="container">
            <div class="display">
                <div class="photo">
                    <label htmlFor="file">
                        <paper-icon-button icon="camera-enhance" class="camera"></paper-icon-button>
                        <image id="icon" src="[[user.photoURL]]">
                        <input id="file" class="file" type="file" accept="image/*" on-change="capture"></input>
                    </label>
                </div>
                <paper-input id="displayName" class="displayName" always-float-label label="表示名" value="[[user.displayName]]"></paper-input>
            </div>

            <paper-button raised class="on" on-click="update">更新</paper-button>
        </div>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    capture() {
        let file = this.$.file.files[0];
        handleImage( file, 48, dataURL => {
            this.$.icon.src = dataURL;
        } )
    }

    update() {
        console.log( 'update()', this.$.displayName.value, this.user.displayName );

        if( this.$.icon.src && this.$.icon.src !== this.user.photoURL ){
            firebase.database().ref( 'profiles/' + this.user.uid + '/photoURL' ).set( this.$.icon.src );
        }

        if( this.$.displayName.value && this.$.displayName.value !== this.user.displayName ){
            firebase.database().ref( 'profiles/' + this.user.uid + '/displayName' ).set( this.$.displayName.value );
        }

    }

}

window.customElements.define( 'profile-view', ProfileView );
