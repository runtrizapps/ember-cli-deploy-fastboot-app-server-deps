/* eslint-env node */
'use strict';

const BasePlugin = require('ember-cli-deploy-plugin');
const execSync   = require('child_process').execSync;

module.exports = {
  name: 'ember-cli-deploy-fastboot-app-server-deps',

  createDeployPlugin: function(options) {
    let DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        distDir: function(context) {
          return context.distDir;
        },
      },

      prepare: function() {
        let distDir = this.readConfig('distDir');

        execSync('npm install --no-save --production', {
          cwd: distDir,
          stdio: [0, 1, 2],
        });
      },
    });

    return new DeployPlugin();
  },
};
