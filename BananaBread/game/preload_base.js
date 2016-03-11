
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'base.data';
    var REMOTE_PACKAGE_BASE = 'base.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'data', true, true);
Module['FS_createPath']('/', 'packages', true, true);
Module['FS_createPath']('/packages', 'textures', true, true);
Module['FS_createPath']('/packages', 'fonts', true, true);
Module['FS_createPath']('/packages', 'icons', true, true);
Module['FS_createPath']('/packages', 'particles', true, true);
Module['FS_createPath']('/packages', 'sounds', true, true);
Module['FS_createPath']('/packages/sounds', 'aard', true, true);
Module['FS_createPath']('/packages/sounds', 'q009', true, true);
Module['FS_createPath']('/packages/sounds', 'yo_frankie', true, true);
Module['FS_createPath']('/packages', 'gk', true, true);
Module['FS_createPath']('/packages/gk', 'lava', true, true);
Module['FS_createPath']('/packages', 'caustics', true, true);
Module['FS_createPath']('/packages', 'models', true, true);
Module['FS_createPath']('/packages/models', 'debris', true, true);
Module['FS_createPath']('/packages/models', 'projectiles', true, true);
Module['FS_createPath']('/packages/models/projectiles', 'rocket', true, true);
Module['FS_createPath']('/packages/models/projectiles', 'grenade', true, true);
Module['FS_createPath']('/packages', 'brushes', true, true);
Module['FS_createPath']('/packages', 'hud', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Module.printErr('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change

        this.requests[this.name] = null;
      },
    };

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_base.data');

    };
    Module['addRunDependency']('datafile_base.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 7217, "filename": "/data/defaults.cfg"}, {"audio": 0, "start": 7217, "crunched": 0, "end": 10898, "filename": "/data/loading_frame.png"}, {"audio": 0, "start": 10898, "crunched": 0, "end": 58748, "filename": "/data/menus.cfg"}, {"audio": 0, "start": 58748, "crunched": 0, "end": 72300, "filename": "/data/background_decal.png"}, {"audio": 0, "start": 72300, "crunched": 0, "end": 80465, "filename": "/data/game_rpg.cfg"}, {"audio": 0, "start": 80465, "crunched": 0, "end": 80624, "filename": "/data/background_detail.png"}, {"audio": 0, "start": 80624, "crunched": 0, "end": 81637, "filename": "/data/stdlib.cfg"}, {"audio": 0, "start": 81637, "crunched": 0, "end": 84620, "filename": "/data/loading_bar.png"}, {"audio": 0, "start": 84620, "crunched": 0, "end": 90137, "filename": "/data/brush.cfg"}, {"audio": 0, "start": 90137, "crunched": 0, "end": 95021, "filename": "/data/mapshot_frame.png"}, {"audio": 0, "start": 95021, "crunched": 0, "end": 96243, "filename": "/data/default_map_settings.cfg"}, {"audio": 0, "start": 96243, "crunched": 0, "end": 104747, "filename": "/data/stdedit.cfg"}, {"audio": 0, "start": 104747, "crunched": 0, "end": 107154, "filename": "/data/keymap.cfg"}, {"audio": 0, "start": 107154, "crunched": 0, "end": 109986, "filename": "/data/guislider.png"}, {"audio": 0, "start": 109986, "crunched": 0, "end": 110058, "filename": "/data/font.cfg"}, {"audio": 0, "start": 110058, "crunched": 0, "end": 194545, "filename": "/data/glsl.cfg"}, {"audio": 0, "start": 194545, "crunched": 0, "end": 197857, "filename": "/data/teammate.png"}, {"audio": 0, "start": 197857, "crunched": 0, "end": 201623, "filename": "/data/game_fps.cfg"}, {"audio": 0, "start": 201623, "crunched": 0, "end": 206507, "filename": "/data/guioverlay.png"}, {"audio": 0, "start": 206507, "crunched": 0, "end": 209418, "filename": "/data/sounds.cfg"}, {"audio": 0, "start": 209418, "crunched": 0, "end": 299048, "filename": "/data/stdshader.cfg"}, {"audio": 0, "start": 299048, "crunched": 0, "end": 302331, "filename": "/data/hit.png"}, {"audio": 0, "start": 302331, "crunched": 0, "end": 306577, "filename": "/data/guiskin.png"}, {"audio": 0, "start": 306577, "crunched": 0, "end": 306713, "filename": "/data/default_map_models.cfg"}, {"audio": 0, "start": 306713, "crunched": 0, "end": 324275, "filename": "/data/background.png"}, {"audio": 0, "start": 324275, "crunched": 0, "end": 454481, "filename": "/data/logo.png"}, {"audio": 0, "start": 454481, "crunched": 0, "end": 457764, "filename": "/data/crosshair.png"}, {"audio": 0, "start": 457764, "crunched": 0, "end": 461695, "filename": "/data/guicursor.png"}, {"audio": 0, "start": 461695, "crunched": 0, "end": 811518, "filename": "/packages/textures/watern.jpg"}, {"audio": 0, "start": 811518, "crunched": 0, "end": 812189, "filename": "/packages/textures/readme.txt"}, {"audio": 0, "start": 812189, "crunched": 0, "end": 815225, "filename": "/packages/textures/notexture.png"}, {"audio": 0, "start": 815225, "crunched": 0, "end": 1070398, "filename": "/packages/textures/waterdudv.jpg"}, {"audio": 0, "start": 1070398, "crunched": 0, "end": 1312568, "filename": "/packages/textures/waterfalldudv.jpg"}, {"audio": 0, "start": 1312568, "crunched": 0, "end": 1349762, "filename": "/packages/textures/waterfall.jpg"}, {"audio": 0, "start": 1349762, "crunched": 0, "end": 1527324, "filename": "/packages/textures/waterfalln.jpg"}, {"audio": 0, "start": 1527324, "crunched": 0, "end": 1683327, "filename": "/packages/textures/water.jpg"}, {"audio": 0, "start": 1683327, "crunched": 0, "end": 1769451, "filename": "/packages/fonts/font.png"}, {"audio": 0, "start": 1769451, "crunched": 0, "end": 1771693, "filename": "/packages/fonts/default.cfg"}, {"audio": 0, "start": 1771693, "crunched": 0, "end": 1776418, "filename": "/packages/fonts/font_readme.txt"}, {"audio": 0, "start": 1776418, "crunched": 0, "end": 1789914, "filename": "/packages/icons/snoutx10k.jpg"}, {"audio": 0, "start": 1789914, "crunched": 0, "end": 1803194, "filename": "/packages/icons/radio_on.jpg"}, {"audio": 0, "start": 1803194, "crunched": 0, "end": 1816698, "filename": "/packages/icons/hand.jpg"}, {"audio": 0, "start": 1816698, "crunched": 0, "end": 1831832, "filename": "/packages/icons/frankie.jpg"}, {"audio": 0, "start": 1831832, "crunched": 0, "end": 1849824, "filename": "/packages/icons/menu.jpg"}, {"audio": 0, "start": 1849824, "crunched": 0, "end": 1866264, "filename": "/packages/icons/checkbox_off.jpg"}, {"audio": 0, "start": 1866264, "crunched": 0, "end": 1884940, "filename": "/packages/icons/server.jpg"}, {"audio": 0, "start": 1884940, "crunched": 0, "end": 1896602, "filename": "/packages/icons/arrow_bw.jpg"}, {"audio": 0, "start": 1896602, "crunched": 0, "end": 1896699, "filename": "/packages/icons/readme.txt"}, {"audio": 0, "start": 1896699, "crunched": 0, "end": 1909756, "filename": "/packages/icons/exit.jpg"}, {"audio": 0, "start": 1909756, "crunched": 0, "end": 1928063, "filename": "/packages/icons/action.jpg"}, {"audio": 0, "start": 1928063, "crunched": 0, "end": 1940173, "filename": "/packages/icons/arrow_fw.jpg"}, {"audio": 0, "start": 1940173, "crunched": 0, "end": 1944262, "filename": "/packages/icons/menu.png"}, {"audio": 0, "start": 1944262, "crunched": 0, "end": 1957640, "filename": "/packages/icons/info.jpg"}, {"audio": 0, "start": 1957640, "crunched": 0, "end": 1970708, "filename": "/packages/icons/chat.jpg"}, {"audio": 0, "start": 1970708, "crunched": 0, "end": 1988911, "filename": "/packages/icons/checkbox_on.jpg"}, {"audio": 0, "start": 1988911, "crunched": 0, "end": 2001806, "filename": "/packages/icons/cube.jpg"}, {"audio": 0, "start": 2001806, "crunched": 0, "end": 2020534, "filename": "/packages/icons/radio_off.jpg"}, {"audio": 0, "start": 2020534, "crunched": 0, "end": 2022801, "filename": "/packages/particles/blob.png"}, {"audio": 0, "start": 2022801, "crunched": 0, "end": 2027313, "filename": "/packages/particles/smoke.png"}, {"audio": 0, "start": 2027313, "crunched": 0, "end": 2084477, "filename": "/packages/particles/bullet.png"}, {"audio": 0, "start": 2084477, "crunched": 0, "end": 2146629, "filename": "/packages/particles/ball2.png"}, {"audio": 0, "start": 2146629, "crunched": 0, "end": 2216821, "filename": "/packages/particles/flames.png"}, {"audio": 0, "start": 2216821, "crunched": 0, "end": 2542721, "filename": "/packages/particles/lensflares.png"}, {"audio": 0, "start": 2542721, "crunched": 0, "end": 2542965, "filename": "/packages/particles/readme.txt"}, {"audio": 0, "start": 2542965, "crunched": 0, "end": 3276444, "filename": "/packages/particles/explosion.png"}, {"audio": 0, "start": 3276444, "crunched": 0, "end": 3296582, "filename": "/packages/particles/muzzleflash3.jpg"}, {"audio": 0, "start": 3296582, "crunched": 0, "end": 3354444, "filename": "/packages/particles/lightning.jpg"}, {"audio": 0, "start": 3354444, "crunched": 0, "end": 3373949, "filename": "/packages/particles/circle.png"}, {"audio": 0, "start": 3373949, "crunched": 0, "end": 3374194, "filename": "/packages/particles/readme.txt~"}, {"audio": 0, "start": 3374194, "crunched": 0, "end": 3381609, "filename": "/packages/particles/steam.png"}, {"audio": 0, "start": 3381609, "crunched": 0, "end": 3382470, "filename": "/packages/particles/flare.jpg"}, {"audio": 0, "start": 3382470, "crunched": 0, "end": 3401492, "filename": "/packages/particles/muzzleflash2.jpg"}, {"audio": 0, "start": 3401492, "crunched": 0, "end": 3417118, "filename": "/packages/particles/blood.png"}, {"audio": 0, "start": 3417118, "crunched": 0, "end": 3437019, "filename": "/packages/particles/muzzleflash1.jpg"}, {"audio": 0, "start": 3437019, "crunched": 0, "end": 3438824, "filename": "/packages/particles/spark.png"}, {"audio": 0, "start": 3438824, "crunched": 0, "end": 3492756, "filename": "/packages/particles/ball1.png"}, {"audio": 0, "start": 3492756, "crunched": 0, "end": 3532592, "filename": "/packages/particles/scorch.png"}, {"audio": 0, "start": 3532592, "crunched": 0, "end": 3535490, "filename": "/packages/particles/base.png"}, {"audio": 1, "start": 3535490, "crunched": 0, "end": 3543450, "filename": "/packages/sounds/aard/pain5.wav"}, {"audio": 1, "start": 3543450, "crunched": 0, "end": 3568920, "filename": "/packages/sounds/aard/pain1.wav"}, {"audio": 1, "start": 3568920, "crunched": 0, "end": 3578330, "filename": "/packages/sounds/aard/pain2.wav"}, {"audio": 1, "start": 3578330, "crunched": 0, "end": 3584976, "filename": "/packages/sounds/aard/weapload.wav"}, {"audio": 1, "start": 3584976, "crunched": 0, "end": 3597290, "filename": "/packages/sounds/aard/itempick.wav"}, {"audio": 1, "start": 3597290, "crunched": 0, "end": 3607004, "filename": "/packages/sounds/aard/die1.wav"}, {"audio": 1, "start": 3607004, "crunched": 0, "end": 3614670, "filename": "/packages/sounds/aard/pain6.wav"}, {"audio": 1, "start": 3614670, "crunched": 0, "end": 3618364, "filename": "/packages/sounds/aard/grunt2.wav"}, {"audio": 1, "start": 3618364, "crunched": 0, "end": 3630226, "filename": "/packages/sounds/aard/bang.wav"}, {"audio": 1, "start": 3630226, "crunched": 0, "end": 3641632, "filename": "/packages/sounds/aard/grunt1.wav"}, {"audio": 1, "start": 3641632, "crunched": 0, "end": 3652994, "filename": "/packages/sounds/aard/land.wav"}, {"audio": 1, "start": 3652994, "crunched": 0, "end": 3657126, "filename": "/packages/sounds/aard/jump.wav"}, {"audio": 1, "start": 3657126, "crunched": 0, "end": 3665106, "filename": "/packages/sounds/aard/pain4.wav"}, {"audio": 1, "start": 3665106, "crunched": 0, "end": 3666810, "filename": "/packages/sounds/aard/tak.wav"}, {"audio": 1, "start": 3666810, "crunched": 0, "end": 3677462, "filename": "/packages/sounds/aard/die2.wav"}, {"audio": 1, "start": 3677462, "crunched": 0, "end": 3686812, "filename": "/packages/sounds/aard/pain3.wav"}, {"audio": 1, "start": 3686812, "crunched": 0, "end": 3690870, "filename": "/packages/sounds/aard/outofammo.wav"}, {"audio": 1, "start": 3690870, "crunched": 0, "end": 3824656, "filename": "/packages/sounds/q009/ren.ogg"}, {"audio": 1, "start": 3824656, "crunched": 0, "end": 3850912, "filename": "/packages/sounds/q009/minigun3.ogg"}, {"audio": 1, "start": 3850912, "crunched": 0, "end": 3868787, "filename": "/packages/sounds/q009/outofammo.ogg"}, {"audio": 1, "start": 3868787, "crunched": 0, "end": 3902015, "filename": "/packages/sounds/q009/glauncher3.ogg"}, {"audio": 1, "start": 3902015, "crunched": 0, "end": 3959660, "filename": "/packages/sounds/q009/rlauncher3.ogg"}, {"audio": 1, "start": 3959660, "crunched": 0, "end": 4062726, "filename": "/packages/sounds/q009/ren2.ogg"}, {"audio": 1, "start": 4062726, "crunched": 0, "end": 4090434, "filename": "/packages/sounds/q009/quaddamage_shoot.ogg"}, {"audio": 0, "start": 4090434, "crunched": 0, "end": 4091750, "filename": "/packages/sounds/q009/readme.txt"}, {"audio": 1, "start": 4091750, "crunched": 0, "end": 4220787, "filename": "/packages/sounds/q009/rifle.ogg"}, {"audio": 1, "start": 4220787, "crunched": 0, "end": 4249181, "filename": "/packages/sounds/q009/pistol.ogg"}, {"audio": 1, "start": 4249181, "crunched": 0, "end": 4277068, "filename": "/packages/sounds/q009/minigun.ogg"}, {"audio": 1, "start": 4277068, "crunched": 0, "end": 4309690, "filename": "/packages/sounds/q009/quaddamage_out.ogg"}, {"audio": 1, "start": 4309690, "crunched": 0, "end": 4336590, "filename": "/packages/sounds/q009/pistol3.ogg"}, {"audio": 1, "start": 4336590, "crunched": 0, "end": 4362763, "filename": "/packages/sounds/q009/teleport.ogg"}, {"audio": 1, "start": 4362763, "crunched": 0, "end": 4381654, "filename": "/packages/sounds/q009/jumppad.ogg"}, {"audio": 1, "start": 4381654, "crunched": 0, "end": 4505874, "filename": "/packages/sounds/q009/rifle2.ogg"}, {"audio": 1, "start": 4505874, "crunched": 0, "end": 4529202, "filename": "/packages/sounds/q009/minigun2.ogg"}, {"audio": 1, "start": 4529202, "crunched": 0, "end": 4559184, "filename": "/packages/sounds/q009/explosion.ogg"}, {"audio": 1, "start": 4559184, "crunched": 0, "end": 4684264, "filename": "/packages/sounds/q009/shotgun.ogg"}, {"audio": 1, "start": 4684264, "crunched": 0, "end": 4719706, "filename": "/packages/sounds/q009/glauncher2.ogg"}, {"audio": 1, "start": 4719706, "crunched": 0, "end": 4753393, "filename": "/packages/sounds/q009/glauncher.ogg"}, {"audio": 1, "start": 4753393, "crunched": 0, "end": 4781775, "filename": "/packages/sounds/q009/pistol2.ogg"}, {"audio": 0, "start": 4781775, "crunched": 0, "end": 4801215, "filename": "/packages/sounds/q009/license.txt"}, {"audio": 1, "start": 4801215, "crunched": 0, "end": 4917654, "filename": "/packages/sounds/q009/ren3.ogg"}, {"audio": 1, "start": 4917654, "crunched": 0, "end": 4938097, "filename": "/packages/sounds/q009/weapswitch.ogg"}, {"audio": 1, "start": 4938097, "crunched": 0, "end": 4996034, "filename": "/packages/sounds/q009/rlauncher.ogg"}, {"audio": 1, "start": 4996034, "crunched": 0, "end": 5054733, "filename": "/packages/sounds/q009/rlauncher2.ogg"}, {"audio": 1, "start": 5054733, "crunched": 0, "end": 5177416, "filename": "/packages/sounds/q009/rifle3.ogg"}, {"audio": 1, "start": 5177416, "crunched": 0, "end": 5303518, "filename": "/packages/sounds/q009/shotgun2.ogg"}, {"audio": 1, "start": 5303518, "crunched": 0, "end": 5427916, "filename": "/packages/sounds/q009/shotgun3.ogg"}, {"audio": 0, "start": 5427916, "crunched": 0, "end": 5428546, "filename": "/packages/sounds/yo_frankie/readme.txt"}, {"audio": 1, "start": 5428546, "crunched": 0, "end": 5452451, "filename": "/packages/sounds/yo_frankie/watersplash2.ogg"}, {"audio": 1, "start": 5452451, "crunched": 0, "end": 5459864, "filename": "/packages/sounds/yo_frankie/sfx_interact.ogg"}, {"audio": 1, "start": 5459864, "crunched": 0, "end": 5479473, "filename": "/packages/sounds/yo_frankie/amb_waterdrip_2.ogg"}, {"audio": 0, "start": 5479473, "crunched": 0, "end": 5654377, "filename": "/packages/gk/lava/lava_cc.dds"}, {"audio": 0, "start": 5654377, "crunched": 0, "end": 6004057, "filename": "/packages/gk/lava/lava_nm.dds"}, {"audio": 0, "start": 6004057, "crunched": 0, "end": 6028576, "filename": "/packages/caustics/caust00.png"}, {"audio": 0, "start": 6028576, "crunched": 0, "end": 6052020, "filename": "/packages/caustics/caust22.png"}, {"audio": 0, "start": 6052020, "crunched": 0, "end": 6075344, "filename": "/packages/caustics/caust06.png"}, {"audio": 0, "start": 6075344, "crunched": 0, "end": 6099211, "filename": "/packages/caustics/caust07.png"}, {"audio": 0, "start": 6099211, "crunched": 0, "end": 6124397, "filename": "/packages/caustics/caust13.png"}, {"audio": 0, "start": 6124397, "crunched": 0, "end": 6147898, "filename": "/packages/caustics/caust28.png"}, {"audio": 0, "start": 6147898, "crunched": 0, "end": 6172062, "filename": "/packages/caustics/caust11.png"}, {"audio": 0, "start": 6172062, "crunched": 0, "end": 6195706, "filename": "/packages/caustics/caust27.png"}, {"audio": 0, "start": 6195706, "crunched": 0, "end": 6195764, "filename": "/packages/caustics/readme.txt"}, {"audio": 0, "start": 6195764, "crunched": 0, "end": 6219926, "filename": "/packages/caustics/caust08.png"}, {"audio": 0, "start": 6219926, "crunched": 0, "end": 6244042, "filename": "/packages/caustics/caust02.png"}, {"audio": 0, "start": 6244042, "crunched": 0, "end": 6267617, "filename": "/packages/caustics/caust03.png"}, {"audio": 0, "start": 6267617, "crunched": 0, "end": 6292066, "filename": "/packages/caustics/caust15.png"}, {"audio": 0, "start": 6292066, "crunched": 0, "end": 6315891, "filename": "/packages/caustics/caust10.png"}, {"audio": 0, "start": 6315891, "crunched": 0, "end": 6339089, "filename": "/packages/caustics/caust04.png"}, {"audio": 0, "start": 6339089, "crunched": 0, "end": 6362972, "filename": "/packages/caustics/caust09.png"}, {"audio": 0, "start": 6362972, "crunched": 0, "end": 6386722, "filename": "/packages/caustics/caust29.png"}, {"audio": 0, "start": 6386722, "crunched": 0, "end": 6411079, "filename": "/packages/caustics/caust16.png"}, {"audio": 0, "start": 6411079, "crunched": 0, "end": 6434285, "filename": "/packages/caustics/caust25.png"}, {"audio": 0, "start": 6434285, "crunched": 0, "end": 6458539, "filename": "/packages/caustics/caust30.png"}, {"audio": 0, "start": 6458539, "crunched": 0, "end": 6483031, "filename": "/packages/caustics/caust01.png"}, {"audio": 0, "start": 6483031, "crunched": 0, "end": 6507574, "filename": "/packages/caustics/caust31.png"}, {"audio": 0, "start": 6507574, "crunched": 0, "end": 6532626, "filename": "/packages/caustics/caust14.png"}, {"audio": 0, "start": 6532626, "crunched": 0, "end": 6555496, "filename": "/packages/caustics/caust05.png"}, {"audio": 0, "start": 6555496, "crunched": 0, "end": 6580037, "filename": "/packages/caustics/caust18.png"}, {"audio": 0, "start": 6580037, "crunched": 0, "end": 6603312, "filename": "/packages/caustics/caust23.png"}, {"audio": 0, "start": 6603312, "crunched": 0, "end": 6626950, "filename": "/packages/caustics/caust21.png"}, {"audio": 0, "start": 6626950, "crunched": 0, "end": 6650504, "filename": "/packages/caustics/caust26.png"}, {"audio": 0, "start": 6650504, "crunched": 0, "end": 6674683, "filename": "/packages/caustics/caust19.png"}, {"audio": 0, "start": 6674683, "crunched": 0, "end": 6699424, "filename": "/packages/caustics/caust12.png"}, {"audio": 0, "start": 6699424, "crunched": 0, "end": 6722593, "filename": "/packages/caustics/caust24.png"}, {"audio": 0, "start": 6722593, "crunched": 0, "end": 6747072, "filename": "/packages/caustics/caust17.png"}, {"audio": 0, "start": 6747072, "crunched": 0, "end": 6771178, "filename": "/packages/caustics/caust20.png"}, {"audio": 0, "start": 6771178, "crunched": 0, "end": 6771421, "filename": "/packages/models/debris/md2.cfg"}, {"audio": 0, "start": 6771421, "crunched": 0, "end": 6786197, "filename": "/packages/models/debris/tris.md2"}, {"audio": 0, "start": 6786197, "crunched": 0, "end": 6978023, "filename": "/packages/models/debris/skin.png"}, {"audio": 0, "start": 6978023, "crunched": 0, "end": 6981159, "filename": "/packages/models/projectiles/rocket/rocket.iqm"}, {"audio": 0, "start": 6981159, "crunched": 0, "end": 6981819, "filename": "/packages/models/projectiles/rocket/readme.txt"}, {"audio": 0, "start": 6981819, "crunched": 0, "end": 6995056, "filename": "/packages/models/projectiles/rocket/skin.jpg"}, {"audio": 0, "start": 6995056, "crunched": 0, "end": 7015824, "filename": "/packages/models/projectiles/rocket/mask.jpg"}, {"audio": 0, "start": 7015824, "crunched": 0, "end": 7023543, "filename": "/packages/models/projectiles/rocket/normal.jpg"}, {"audio": 0, "start": 7023543, "crunched": 0, "end": 7023699, "filename": "/packages/models/projectiles/rocket/iqm.cfg"}, {"audio": 0, "start": 7023699, "crunched": 0, "end": 7023837, "filename": "/packages/models/projectiles/grenade/iqm.cfg"}, {"audio": 0, "start": 7023837, "crunched": 0, "end": 7028169, "filename": "/packages/brushes/circle_64_hard.png"}, {"audio": 0, "start": 7028169, "crunched": 0, "end": 7029352, "filename": "/packages/brushes/square_32_hard.png"}, {"audio": 0, "start": 7029352, "crunched": 0, "end": 7029481, "filename": "/packages/brushes/gradient_64.png"}, {"audio": 0, "start": 7029481, "crunched": 0, "end": 7030476, "filename": "/packages/brushes/circle_8_solid.png"}, {"audio": 0, "start": 7030476, "crunched": 0, "end": 7031457, "filename": "/packages/brushes/square_32_solid.png"}, {"audio": 0, "start": 7031457, "crunched": 0, "end": 7031594, "filename": "/packages/brushes/gradient_128.png"}, {"audio": 0, "start": 7031594, "crunched": 0, "end": 7032586, "filename": "/packages/brushes/circle_8_soft.png"}, {"audio": 0, "start": 7032586, "crunched": 0, "end": 7032689, "filename": "/packages/brushes/gradient_16.png"}, {"audio": 0, "start": 7032689, "crunched": 0, "end": 7032748, "filename": "/packages/brushes/readme.txt"}, {"audio": 0, "start": 7032748, "crunched": 0, "end": 7033870, "filename": "/packages/brushes/circle_16_hard.png"}, {"audio": 0, "start": 7033870, "crunched": 0, "end": 7037958, "filename": "/packages/brushes/circle_128_hard.png"}, {"audio": 0, "start": 7037958, "crunched": 0, "end": 7041518, "filename": "/packages/brushes/circle_32_hard.png"}, {"audio": 0, "start": 7041518, "crunched": 0, "end": 7042514, "filename": "/packages/brushes/circle_8_hard.png"}, {"audio": 0, "start": 7042514, "crunched": 0, "end": 7043520, "filename": "/packages/brushes/square_64_solid.png"}, {"audio": 0, "start": 7043520, "crunched": 0, "end": 7053155, "filename": "/packages/brushes/noise_128.png"}, {"audio": 0, "start": 7053155, "crunched": 0, "end": 7054128, "filename": "/packages/brushes/square_16_solid.png"}, {"audio": 0, "start": 7054128, "crunched": 0, "end": 7057605, "filename": "/packages/brushes/circle_128_soft.png"}, {"audio": 0, "start": 7057605, "crunched": 0, "end": 7058696, "filename": "/packages/brushes/circle_16_soft.png"}, {"audio": 0, "start": 7058696, "crunched": 0, "end": 7058816, "filename": "/packages/brushes/gradient_32.png"}, {"audio": 0, "start": 7058816, "crunched": 0, "end": 7061180, "filename": "/packages/brushes/circle_128_solid.png"}, {"audio": 0, "start": 7061180, "crunched": 0, "end": 7062293, "filename": "/packages/brushes/circle_16_solid.png"}, {"audio": 0, "start": 7062293, "crunched": 0, "end": 7064107, "filename": "/packages/brushes/circle_64_soft.png"}, {"audio": 0, "start": 7064107, "crunched": 0, "end": 7065392, "filename": "/packages/brushes/circle_32_soft.png"}, {"audio": 0, "start": 7065392, "crunched": 0, "end": 7066474, "filename": "/packages/brushes/square_16_hard.png"}, {"audio": 0, "start": 7066474, "crunched": 0, "end": 7067681, "filename": "/packages/brushes/square_64_hard.png"}, {"audio": 0, "start": 7067681, "crunched": 0, "end": 7068919, "filename": "/packages/brushes/circle_32_solid.png"}, {"audio": 0, "start": 7068919, "crunched": 0, "end": 7070503, "filename": "/packages/brushes/circle_64_solid.png"}, {"audio": 0, "start": 7070503, "crunched": 0, "end": 7072793, "filename": "/packages/brushes/noise_64.png"}, {"audio": 0, "start": 7072793, "crunched": 0, "end": 7216537, "filename": "/packages/hud/damage.png"}, {"audio": 0, "start": 7216537, "crunched": 0, "end": 7216608, "filename": "/packages/hud/readme.txt"}, {"audio": 0, "start": 7216608, "crunched": 0, "end": 7237929, "filename": "/packages/hud/wasm.png"}, {"audio": 0, "start": 7237929, "crunched": 0, "end": 7259234, "filename": "/packages/hud/js.png"}, {"audio": 0, "start": 7259234, "crunched": 0, "end": 7364635, "filename": "/packages/hud/items.png"}], "remote_package_size": 7364635, "package_uuid": "4a316207-e1a3-4bb8-b1c0-b270a092505c"});

})();

