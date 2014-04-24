/**
 * PgwModal - Version 1.2
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
            close: true,
            maxWidth: 500,
            loading: 'Loading in progress...',
            error: 'An error has occured. Please try again in a few moments.'
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
            var appendBody = '<div id="pgwModalWrapper"></div>'
                + '<div id="pgwModal">'
                + '<div class="pm-container">'
                + '<div class="pm-body">'
                + '<a href="javascript:void(0)" class="pm-close" onclick="$.pgwModal(\'close\')"></a>'
                + '<div class="pm-title"></div>'
                + '<div class="pm-content cntr"></div>'
                + '</div>'
                + '</div>'
                + '</div>';
            $('body').append(appendBody);
            return true;
        };

        // Reset modal container
        var reset = function() {
            $('#pgwModal .pm-title, #pgwModal .pm-content').html('');
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
            if (pgwModal.config.angular) {
                angularCompilation();
            }
            reposition();
            return true;
        };
        
        // Repositions the modal
        var reposition = function() {
            var windows_height = $(window).height();
            var modal_height = $('#pgwModal .pm-body').height();
            var margin_top = Math.round((windows_height - modal_height)/3);
            if (margin_top <= 0) {
                margin_top = 10;
            }
            $('#pgwModal .pm-body').css('margin-top', margin_top);
            return true;
        };
        
        // Returns the modal data
        var getData = function() {
            return pgwModal.config.modalData;
        };
        
        // Returns the modal status
        var isOpen = function() {
            return $('body').hasClass('pgwModal');
        };

        // Close the modal
        var close = function() {
            $('#pgwModal, #pgwModalWrapper').hide();
            $('body').removeClass('pgwModal');
            reset();
            delete window.pgwModalObject;
            return true;
        };

        // Open the modal
        var open = function() {
            if ($('#pgwModal').length == 0) {
                create();
            } else {
                reset();
            }

            if (! pgwModal.config.close) {
                $('#pgwModal .pm-close').hide();
            } else {
                $('#pgwModal .pm-close').show();
            }

            if (pgwModal.config.title) {
                $('#pgwModal .pm-title').text(pgwModal.config.title);
            }

            if (pgwModal.config.maxWidth) {
                $('#pgwModal .pm-body').css('max-width', pgwModal.config.maxWidth);
            }

            // Content loaded by Ajax
            if (pgwModal.config.url) {
                if (pgwModal.config.loading) {
                    $('#pgwModal .pm-content').html(pgwModal.config.loading);
                }

                var ajaxOptions = {
                    'url' : obj.url,
                    'success' : function(data) {
                        pushContent(data);
                    },
                    'error' : function() {
                        $('#pgwModal .pm-content').html(pgwModal.config.error);
                    }
                };

                if (pgwModal.config.ajaxOptions) {
                    ajaxOptions = $.extend({}, ajaxOptions, pgwModal.config.ajaxOptions);
                }

                $.ajax(ajaxOptions);
                
            // Content loaded by a html element
            } else if (pgwModal.config.target) {
                pushContent($(pgwModal.config.target).html());

            // Content loaded by a html element
            } else if (pgwModal.config.content) {
                pushContent(pgwModal.config.content);
            }

            $('#pgwModal, #pgwModalWrapper').show();
            $('body').addClass('pgwModal');			
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
})(jQuery);
