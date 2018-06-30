/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './comment-post-view.js';
import './comments-view.js';

class ChatView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        .comments {
            padding-top: 2em;
            padding-bottom: 3em;
        }
        .post {
            background-color: white;
            border-top: 1px solid rgba(0,0,0,.12);
            position: fixed;
            bottom: 0;
            height: 3.5em;
            width: 100%;
            max-width: 384px;
        }
        .profile {
            background-color: #EEE;
            padding: .25em;
            height: 2em;
            width: 100%;
            position: fixed;
            top: 64;
        }
            .profile .icon {
                vertical-align: bottom;
            }
            .profile .name {
                margin-right: .5em;
            }
        </style>
        <div>
            <div class="profile">
                <img src="{{talkerProfile.photoURL}}" class="icon">
                <span class="name">{{talkerProfile.displayName}}</span>へのコメント
            </div>
            <div class="comments">
                <comments-view comments={{comments}}></comments-view>
            </div>
            <div class="post">
                <comment-post-view user={{user}} talker={{talker}}></comment-post-view>
            </div>
            <div id="bottom"></div>
      </div>
    `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.comments = [];
        this.talkerProfile = { displayName: '板垣真太郎', email: '', photo: 'images/manifest/icon-48x48.png' };
    }

    static get properties() {
        return {
            user: Object,
            talker: { type: String, observer: '_talkerChanged' }
        }
    }

    _talkerChanged( newValue, oldValue ) {
        console.log( '_talkerChanged', newValue );
        this.comments = [];
        this.startListening( newValue );
    }

    // Function to add a data listener
    startListening( talker ) {
        console.log( 'startListening()', talker );
        this.comments = [];
        firebase.database().ref( 'comments/user:' + talker ).on( 'child_added', snapshot => {
            this.push( 'comments', snapshot.val() );
        } );
        firebase.database().ref( 'profiles/' + talker ).once( 'value' ).then( snapshot => {
            this.talkerProfile = snapshot.val();
        } );
    }

}

window.customElements.define( 'chat-view', ChatView );
