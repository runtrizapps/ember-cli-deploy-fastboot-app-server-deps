/* eslint-env node */
'use strict';

// const fs     = require('fs');
// const AdmZip = require('adm-zip');
// const mkdirp = require('mkdirp');
// const rimraf = require('rimraf');
const assert = require('./helpers/assert');

var stubProject = {
  name: function() {
    return 'my-project';
  }
};

describe('fastboot-app-server plugin', function() {
  var subject, plugin, mockUI, context;

  before(function() {
    subject = require('../index');
  });

  beforeEach(function() {
    mockUI = {
      verbose: true,
      messages: [],
      write: function() { },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };

    plugin = subject.createDeployPlugin({
      name: 'fastboot-app-server'
    });

    context = {
      ui: mockUI,

      project: stubProject,

      commandOptions: {},

      config: {
        'fastboot-app-server': {
        }
      }
    }
  });

  it('has a name', function() {
    assert.equal(plugin.name, 'fastboot-app-server');
  });

  describe('hooks', function() {
    beforeEach(function() {
      plugin.beforeHook(context);
      plugin.configure(context);
    });

    it('implements the correct hooks', function() {
      assert.ok(plugin.prepare);
    });

    describe('#setup', function() {
      it('adds a function to the deploy context that can be used to write a fastboot-app-server manifest', function() {
        let dataToMergeIntoDeployContext = plugin.setup(context);

        let downloaderManifestContent = dataToMergeIntoDeployContext.fastbootDownloaderManifestContent;

        let manifestContent = downloaderManifestContent('bucket-name', 'revision-key');

        let expectedJSON = {
          bucket: 'bucket-name',
          key: 'revision-key'
        };

        assert.deepEqual(JSON.parse(manifestContent), expectedJSON);
      });

      it('adds a `fastbootArchivePrefix` to the deploy context that can be used in other hooks to work out a name for the fastboot build to deploy', function() {
        let dataToMergeIntoDeployContext = plugin.setup(context);

        assert.equal(dataToMergeIntoDeployContext.fastbootArchivePrefix, 'dist-');
      });
    });

    describe('#prepare', function() {
      // beforeEach(function() {
      //   let DIST_DIR = 'tmp/deploy-dist'
      //
      //   rimraf.sync('tmp');
      //
      //   context.fastbootArchivePrefix = 'dist-';
      //   context.distDir = DIST_DIR;
      //   context.revisionData = {
      //     revisionKey: '1234'
      //   };
      //
      //   mkdirp.sync(DIST_DIR);
      //   fs.writeFileSync(`${DIST_DIR}/deploy.txt`, 'deployment');
      // });
      //
      // it('zips the contents of `distDir` and writes them to `fastbootDistDir` as a zip tagged by `revisionKey`', function() {
      //   plugin.didPrepare(context);
      //
      //   assert.ok(fs.existsSync('tmp/fastboot-deploy/dist-1234.zip'));
      // });
      //
      // it('zips the content of distDir as expected', function() {
      //   plugin.didPrepare(context);
      //
      //   let zip = new AdmZip('tmp/fastboot-deploy/dist-1234.zip');
      //   zip.extractAllTo('tmp/fastboot-deploy', true);
      //
      //   let deployText = fs.readFileSync('tmp/fastboot-deploy/dist/deploy.txt')
      //
      //   assert.equal(deployText, 'deployment');
      // });
      //
      // it('adds fastbootArchiveName and fastbootArchivePath info to the deplyoment context', function() {
      //   let info = plugin.didPrepare(context);
      //
      //   assert.equal(info.fastbootArchiveName, 'dist-1234.zip');
      //   assert.equal(info.fastbootArchivePath, 'tmp/fastboot-deploy/dist-1234.zip');
      // });
    });
  });
});
