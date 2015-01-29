PgwModal
========

The full documentation and an example are available on [**PgwJS.com**/PgwModal](http://pgwjs.com/pgwmodal/).

Installation
---------

According to your system, select the preferred installation mode:

### JavaScript

Download the plugin by cliking the button **Download ZIP** on the right.  
To get the plugin updates, fork it on Github and regularly verify your plugin version.

### Node / NPM

    npm install pgwmodal

Requirements
---------

jQuery 1.0 or Zepto.js 1.0 (minimal version)


Contributing
---------

All issues or pull requests must be submitted through GitHub.

* To report an issue or a feature request, please use [GitHub Issues](https://github.com/Pagawa/PgwModal/issues).
* To make a pull request, please create a new branch for each feature or issue.


ChangeLog
---------

* Version 2 (newest)
    * 2014-08-23 - The version 2.0 has been released, it brings improvements and new functionalities:
        - Refactoring HTML and CSS.
        - The title bar can be totally removed.
        - Automatic repositioning after resizing or orientation change.
        - 3 new closing functionalities: "Close on escape" (enabled by default), "Close on background click" (enabled by default), and customization of the image/link (Defaults to the current black cross).
        - This version prevents the gap on the background content at the opening of the modal.
        - **WARNING** Several parameters have been renamed: "close" option becomes "closable", "loading" option becomes "loadingContent", and "error" option becomes "errorContent".

* Version 1 (deprecated)
    * 2014-08-21 - Fix for reposition function by Hummerpj (Version 1.5)
    * 2014-07-02 - Fix for Zepto (Version 1.4)
    * 2014-05-30 - Added 4 modal events.  View details on [PgwJS.com](http://pgwjs.com/pgwmodal/) (Version 1.3)
    * 2014-05-29 - IE8 bug fix : Delete window object / YUI compressor fix : Angular compilation (Version 1.2.2)
    * 2014-04-24 - Added the "isOpen" function (Version 1.2)
    * 2014-03-20 - Update of default modal style (Version 1.1)
