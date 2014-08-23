/**
 * PgwModal - Version 2.0
 *
 * Copyright 2014, Jonathan M. Piat
 * http://pgwjs.com - http://pagawa.com
 * 
 * Released under the GNU GPLv3 license - http://opensource.org/licenses/gpl-3.0
 */
;(function($){
    $.pgwModal = function(obj) {

        var pgwModal = {};
        var defaults = {
            mainClassName : 'pgwModal',
            maxWidth : 500,
            titleBar : true,
            closable : true,
            closeOnEscape : true,
            closeOnBackgroundClick : true,
            closeContent : '<span class="pm-icon"></span>',
            loadingContent : 'Loading in progress...',
            errorContent : 'An error has occured. Please try again in a few moments.'
        };

        if (typeof window.pgwModalObject != 'undefined') {
            pgwModal = window.pgwModalObject;
        }

        // Merge the defaults and the user's config
        if ((typeof obj == 'object') && (! obj.pushContent)) {
            if (! obj.url && ! obj.target && ! obj.content) {
                throw new Error('PgwModal - There is no content to display, please provide a config parameter : "url", "target" or "content"');
            }

            pgwModal.config = {};
            pgwModal.config = $.extend({}, defaults, obj);
            window.pgwModalObject = pgwModal;
        }

        // Create modal container
        var create = function() {
            var appendBody = '<div id="pgwModal">'
                + '<div class="pm-backdrop"></div>'
                + '<div class="pm-body">'
                + '<span class="pm-close"></span>'
                + '<div class="pm-title"></div>'
                + '<div class="pm-content"></div>'
                + '</div>'
                + '</div>';

            $('body').append(appendBody);
            $(document).trigger('PgwModal::Create');
            return true;
        };

        // Reset modal container
        var reset = function() {
            $('#pgwModal .pm-title, #pgwModal .pm-content').html('');
            $('#pgwModal .pm-close').html('').unbind('click');
            return true;
        };

        // Angular compilation
        var angularCompilation = function() {
            angular.element('body').injector().invoke(function($compile) {
                var scope = angular.element($('#pgwModal .pm-content')).scope();
                $compile($('#pgwModal .pm-content'))(scope);
                scope.$digest();
            });
            return true;
        };

        // Push content into the modal
        var pushContent = function(content) {
            $('#pgwModal .pm-content').html(content);

            // Angular
            if (pgwModal.config.angular) {
                angularCompilation();
            }

            reposition();

            $(document).trigger('PgwModal::PushContent');
            return true;
        };

        // Repositions the modal
        var reposition = function() {
            // Elements must be visible before height calculation
            $('#pgwModal').show();

            var windowHeight = $(window).height();
            var modalHeight = $('#pgwModal .pm-body').height();
            var marginTop = Math.round((windowHeight - modalHeight) / 3);
            if (marginTop <= 0) {
                marginTop = 10;
            }

            $('#pgwModal .pm-body').css('margin-top', marginTop);
            return true;
        };

        // Returns the modal data
        var getData = function() {
            return pgwModal.config.modalData;
        };
        
        // Returns the scrollbar width
        var getScrollbarWidth = function() {
            var container = $('<div style="width:50px;height:50px;overflow:auto"><div></div></div>').appendTo('body');
            var child = container.children();
            
            // Check for Zepto
            if (typeof child.innerWidth != 'function') {
                return 0;
            }
            
            var width = child.innerWidth() - child.height(90).innerWidth();
            container.remove();

            return width;
        };

        // Returns the modal status
        var isOpen = function() {
            return $('body').hasClass('pgwModalOpen');
        };

        // Close the modal
        var close = function() {
            $('#pgwModal').removeClass().hide();
            $('body').css('padding-right', '').removeClass('pgwModalOpen');

            reset();
            $(document).unbind('keyup.PgwModal');
            $('#pgwModal').unbind('click.PgwModalBackdrop');

            try {
                delete window.pgwModalObject; 
            } catch(e) {
                window['pgwModalObject'] = undefined; 
            }

            $(document).trigger('PgwModal::Close');
            return true;
        };

        // Open the modal
        var open = function() {
            if ($('#pgwModal').length == 0) {
                create();
            } else {
                reset();
            }

            // Set the main CSS class
            $('#pgwModal').removeClass().addClass(pgwModal.config.mainClassName);

            // Close button
            if (! pgwModal.config.closable) {
                $('#pgwModal .pm-close').html('').unbind('click').hide();
            } else {
                $('#pgwModal .pm-close').html(pgwModal.config.closeContent).click(function() {
                    close();
                }).show();
            }

            // Title bar
            if (! pgwModal.config.titleBar) {
                $('#pgwModal .pm-title').hide();
            } else {
                $('#pgwModal .pm-title').show();
            }

            if (pgwModal.config.title) {
                $('#pgwModal .pm-title').text(pgwModal.config.title);
            }

            if (pgwModal.config.maxWidth) {
                $('#pgwModal .pm-body').css('max-width', pgwModal.config.maxWidth);
            }

            // Content loaded by Ajax
            if (pgwModal.config.url) {
                if (pgwModal.config.loadingContent) {
                    $('#pgwModal .pm-content').html(pgwModal.config.loadingContent);
                }

                var ajaxOptions = {
                    'url' : obj.url,
                    'success' : function(data) {
                        pushContent(data);
                    },
                    'error' : function() {
                        $('#pgwModal .pm-content').html(pgwModal.config.errorContent);
                    }
                };

                if (pgwModal.config.ajaxOptions) {
                    ajaxOptions = $.extend({}, ajaxOptions, pgwModal.config.ajaxOptions);
                }

                $.ajax(ajaxOptions);
                
            // Content loaded by a html element
            } else if (pgwModal.config.target) {
                pushContent($(pgwModal.config.target).html());

            // Content loaded by a html object
            } else if (pgwModal.config.content) {
                pushContent(pgwModal.config.content);
            }

            // Close on escape
            if (pgwModal.config.closeOnEscape && pgwModal.config.closable) {
                $(document).bind('keyup.PgwModal', function(e) {
                    if (e.keyCode == 27) {
                        close();
                    }
                });
            }

            // Close on background click
            if (pgwModal.config.closeOnBackgroundClick && pgwModal.config.closable) {
                $('#pgwModal').bind('click.PgwModalBackdrop', function(e) {
                    var targetBackdrop = $(e.target).hasClass('pm-backdrop');
                    if (targetBackdrop) {
                        close();
                    }
                });
            }

            // Add CSS class on the body tag
            $('body').addClass('pgwModalOpen');

            var currentScrollbarWidth = getScrollbarWidth();
            if (currentScrollbarWidth > 0) {
                $('body').css('padding-right', currentScrollbarWidth);
            }
            
            $(document).trigger('PgwModal::Open');
            return true;
        };

        // Choose the action
        if ((typeof obj == 'string') && (obj == 'close')) {
            return close();

        } else if ((typeof obj == 'string') && (obj == 'reposition')) {
            return reposition();

        } else if ((typeof obj == 'string') && (obj == 'getData')) {
            return getData();
            
        } else if ((typeof obj == 'string') && (obj == 'isOpen')) {
            return isOpen();

        } else if ((typeof obj == 'object') && (obj.pushContent)) {
            return pushContent(obj.pushContent);

        } else if (typeof obj == 'object') {
            return open();
        }
    }
})(window.Zepto || window.jQuery);
