/*!
 * jQuery pearl sale table v1.5.0
 * https://appendgrid.apphb.com/
 *
 * Copyright 2014 Albert L.
 * Dual licensed under the LGPL (http://www.gnu.org/licenses/lgpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * Depends:
 * jQuery v1.9.1+
 * jquery UI v1.10.2+
 */
(function ($) {
	// The default initial options.
	var _defaultInitOptions = {
		// The total number of empty rows generated when init the grid. This will be ignored if `initData` is assigned.
		initRows : 3,
		// An array of data to be filled after initialized the grid.
		initData : null,
		// Array of column options.
		columns : null,
		// Labels or messages used in grid.
		i18n : null,
		// The ID prefix of controls generated inside the grid. Table ID will be used if not defined.
		idPrefix : null,
		// Enable row dragging by using jQuery UI sortable on grid rows.
		rowDragging : false,
		// The extra class names for table sections.
		sectionClasses : null,
		// The variable name of row count used for object mode of getAllValue
		rowCountName : '_RowCount',
		// The callback function to be triggered after all data loaded to grid.
		dataLoaded : null,
		// The callback function to be triggered after data loaded to a row.
		rowDataLoaded : null,
		// The callback function to be triggered after new row appended.
		afterRowAppended : null,
		// The callback function to be triggered after new row inserted.
		afterRowInserted : null,
		// The callback function to be triggered after grid row swapped.
		afterRowSwapped : null,
		// The callback function to be triggered before grid row remove.
		beforeRowRemove : null,
		// The callback function to be triggered after grid row removed.
		afterRowRemoved : null,
		// The callback function to be triggered after grid row dragged.
		afterRowDragged : null,

		//Default column options
		defaultColumns : [{
				type : 'text',
				diplay : 'No',
				displayCss : null,
				dataPriority : '1'
			}, {
				type : 'checkbox',
				diplay : 'No',
				displayCss : null,
				dataPriority : '2',
				visible : false
			},
		]
	};
	// Default column options.
	var _defaultColumnOptions = {
		// Type of column control.
		type : 'text',
		// Name of column.
		name : null,
		// Default value.
		value : null,
		// Display text on the header section.
		display : null,
		// Extra CSS setting to be added to display text.
		displayCss : null,
		// Tooltip for column head.
		displayTooltip : null,
		// Extra CSS setting to be added to the control container table cell.
		cellCss : null,
		// Extra attributes to be added to the control.
		ctrlAttr : null,
		// Extra properties to be added to the control.
		ctrlProp : null,
		// Extra CSS to be added to the control.
		ctrlCss : null,
		// Extra name of class to be added to the control.
		ctrlClass : null,
		// The available option for building `select` type control.
		ctrlOptions : null,
		// Options for initalize jQuery UI widget.
		uiOption : null,
		// Options for initalize jQuery UI tooltip.
		uiTooltip : null,
		// Let column resizable by using jQuery UI Resizable Interaction.
		resizable : false,
		// Show or hide column after initialized.
		invisible : false,
		// The value to compare for indentify this column value is empty.
		emptyCriteria : null,
		// Callback function to build custom type control.
		customBuilder : null,
		// Callback function to get control value.
		customGetter : null,
		// Callback function to set control value.
		customSetter : null,
		// The `OnClick` event callback of control.
		onClick : null,
		// The `OnChange` event callback of control.
		onChange : null
	};
	var _systemMessages = {
		noColumnInfo : 'Cannot initial grid without column information!',
		elemNotTable : 'Cannot initial grid on element other than TABLE!',
		notInit : '`appendGrid` does not initialized',
		getValueMultiGrid : 'Cannot get values on multiple grid',
		notSupportMethod : 'Method is not supported by `appendGrid`: '
	};
	var _defaultTextResources = {
		append : 'Append Row',
		removeLast : 'Remove Last Row',
		insert : 'Insert Row Above',
		remove : 'Remove Current Row',
		moveUp : 'Move Up',
		moveDown : 'Move Down',
		rowDrag : 'Sort Row',
		rowEmpty : 'This Grid Is Empty'
	};

	var _defaultSectionClasses = {
		caption : null,
		header : null,
		body : null,
		subPanel : null,
		footer : null
	};

	var _defaultButtonResource = {
		'insert' : {
			icon : 'ui-icon-plus',
			onClick : function (tbWhole) {
				function handler(evt) {
					var rowUniqueIndex = $(this).data('appendGrid').uniqueIndex;
					$(tbWhole).pearlSaleTable('insertRow', 1, null, rowUniqueIndex);
					if (evt && evt.preventDefault)
						evt.preventDefault();
					return false;
				};

				return handler;
			}
		},
		'delete' : {
			icon : 'ui-icon-delete',
			onClick : function (tbWhole) {
				function handler(evt) {
					var rowUniqueIndex = $(this).data('appendGrid').uniqueIndex;
					removeRow(tbWhole, null, rowUniqueIndex, false);
					if (evt && evt.preventDefault)
						evt.preventDefault();
					return false;
				}
				return handler;
			}
		},
		'edit' : {
			icon : 'ui-icon-edit'
		}
	}

	var _defaultButtonClasses = {
		append : null,
		removeLast : null,
		insert : null,
		remove : null,
		moveUp : null,
		moveDown : null,
		rowDrag : null
	};
	var _defaultHideButtons = {
		append : false,
		removeLast : false,
		insert : false,
		remove : false,
		moveUp : false,
		moveDown : false
	};
	var _methods = {
		init : function (options) {
			var target = this;
			if (target.length > 0) {
				// Check mandatory paramters included
				if (!$.isArray(options.columns) || options.columns.length == 0) {
					alert(_systemMessages.noColumnInfo);
					return target;
				}
				// Check target element is table or not
				var tbWhole = target[0],
				tbHead,
				tbBody,
				tbFoot,
				tbRow,
				tbCell;
				if (isEmpty(tbWhole.tagName) || tbWhole.tagName != 'TABLE') {
					alert(_systemMessages.elemNotTable);
					return target;
				}
				// Generate settings
				var settings = $.extend({}, _defaultInitOptions, options);
				// Add internal settings
				$.extend(settings, {
					//The UniqueIndex accumulate counter.
					_uniqueIndex : 0,
					// The row order array.
					_rowOrder : [],
					// Indicate data is loaded or not.
					_isDataLoaded : false,
					// Visible column count for internal calculation.
					_visibleCount : 0,
					// Total colSpan count after excluding `hideRowNumColumn` and not generating last column.
					_finalColSpan : 0,
					// Indicate to hide last column or not
					//_hideLastColumn: false
				});
				// Labels or messages used in grid.
				if ($.isPlainObject(options.i18n))
					settings._i18n = $.extend({}, _defaultTextResources, options.i18n);
				else
					settings._i18n = $.extend({}, _defaultTextResources);
				// The extra class names for buttons.
				if ($.isPlainObject(options.buttonClasses))
					settings._buttonClasses = $.extend({}, _defaultButtonClasses, options.buttonClasses);
				else
					settings._buttonClasses = $.extend({}, _defaultButtonClasses);
				// The extra class names for sections.
				if ($.isPlainObject(options.sectionClasses))
					settings._sectionClasses = $.extend({}, _defaultSectionClasses, options.sectionClasses);
				else
					settings._sectionClasses = $.extend({}, _defaultSectionClasses);

				// Make sure the ` hideButtons ` setting defined
				if ($.isPlainObject(options.hideButtons))
					settings.hideButtons = $.extend({}, _defaultHideButtons, options.hideButtons);
				else
					settings.hideButtons = $.extend({}, _defaultHideButtons);

				// Check `idPrefix` is defined
				if (isEmpty(settings.idPrefix)) {
					// Check table ID defined
					if (isEmpty(tbWhole.id) || tbWhole.id == '') {
						// Generate an ID using current time
						settings.idPrefix = 'ag' + new Date().getTime();
					} else {
						settings.idPrefix = tbWhole.id;
					}
				}
				// Check custom grid button parameters
				if (!$.isPlainObject(settings.customGridButtons)) {
					settings.customGridButtons = {};
				}
				// Check rowDragging and useSubPanel option
				if (settings.useSubPanel && settings.rowDragging) {
					settings.rowDragging = false;
				}

				$(tbWhole).empty().addClass('ui-body-d ui-shadow table-stripe ui-responsive');
				$(tbWhole).attr({
					'data-role' : 'table',
					'data-mode' : 'reflow',
					'data-mini' : 'true'
				});
				tbHead = $('<thead></thead>').appendTo(tbWhole);
				tbBody = $('<tbody></tbody>').appendTo(tbWhole);
				tbFoot = $('<tfoot></tfoot>').appendTo(tbWhole);

				var tbHeadRow = $('<tr>').appendTo(tbHead).removeClass();
				if (settings._sectionClasses.header) {
					$(tbHeadRow).addClass(settings._sectionClasses.header);
				}

				var template = $.validator.format("<th 'data-priority'={0} style='text-align:center'>{1}</th>");

				if (!settings.hideRowNumColumn) {
					thCell = $(template("2", "No")).appendTo(tbHeadRow)
				}

				// Prepare column information and add column header
				var pendingSkipCol = 0;
				var colStartIndex = 2

					for (var z = 0; z < settings.columns.length; z++) {
						// Assign default setting
						var className = '';
						var columnOpt = $.extend({}, _defaultColumnOptions, settings.columns[z]);
						settings.columns[z] = columnOpt;
						colStartIndex++;
						// Skip hidden
						if (settings.columns[z].type != 'hidden') {
							// Check column is invisible
							if (!settings.columns[z].invisible) {
								settings._visibleCount++;
							}

							if (settings.columns[z].invisible)
								className += ' invisible';
							if (settings.columns[z].resizable)
								className += ' resizable';

							var display = settings.columns[z].display;
							thCell = $(template(colStartIndex, display)).appendTo(tbHeadRow);
							thCell.id = settings.idPrefix + '_' + settings.columns[z].name + '_td_head';
							thCell.className = className;

							if (settings.columns[z].displayCss)
								$(thCell).css(settings.columns[z].displayCss);
							// Add tooltip
							if ($.isPlainObject(settings.columns[z].displayTooltip)) {
								$(thCell).tooltip(settings.columns[z].displayTooltip);
							} else if (!isEmpty(settings.columns[z].displayTooltip)) {
								$(thCell).attr('title', settings.columns[z].displayTooltip).tooltip();
							}
						} else {
							pendingSkipCol--;
						}
					}

					if (!$.isArray(settings.customRowButtons) || settings.customRowButtons.length == 0) {
						settings._hideLastColumn = true;
					}
					//Calculate the '-finalColSpan' value
					settings_finalColSpan = settings._visibleCount;
				if (!settings.hideRowNumColumn)
					settings._finalColSpan++;
				if (!settings._hideLastColumn)
					settings._finalColSpan++;

				// Add caption when defined
				if (settings.caption) {
					$(tbRow = $('<tr></tr>')).insertBefore($('tr:first', tbHead));
					if (settings._sectionClasses.caption) {
						tbRow.className = settings._sectionClasses.caption;
					}

					$(tbRow).append(tbCell = $('<th></th>'));
					tbCell.id = settings.idPrefix + '_caption_td';
					tbCell.colSpan = settings._finalColSpan;
					// Add tooltip
					if ($.isPlainObject(settings.captionTooltip)) {
						$(tbCell).tooltip(settings.captionTooltip);
					} else if (!isEmpty(settings.captionTooltip)) {
						$(tbCell).attr('title', settings.captionTooltip).tooltip();
					}
					// Check to set display text or generate by function
					if ($.isFunction(settings.caption)) {
						settings.caption(tbCell);
					} else {
						$(tbCell).text(settings.caption);
					}
				}

				// Save options
				$(tbWhole).data('pearlSaleTable', settings);
				if ($.isArray(options.initData)) {
					// Load data if initData is array
					loadData(tbWhole, options.initData, true);
				}

				// Show no rows in grid
				if (settings._rowOrder.length == 0) {
					var empty = $('<td style={display:inline}></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
					$('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
				}
			}
			$(target).table();
			return target;
		},
		isReady : function () {
			// Check the appendGrid is initialized or not
			var settings = checkGridAndGetSettings(this, true);
			if (settings) {
				return true;
			}
			return false;
		},
		isDataLoaded : function () {
			// Check the grid data is loaded by `load` method or `initData` parameter or not
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				return settings._isDataLoaded;
			}
			return false;
		},
		load : function (records) {
			var settings = checkGridAndGetSettings(this),
			target = this;
			if (settings) {
				if (records != null && records.length > 0) {
					loadData(target[0], records, false);
				} else {
					emptyGrid(target[0]);
				}
			}
			return target;
		},
		appendRow : function (numOfRowOrRowArray) {
			return this.appendGrid('insertRow', numOfRowOrRowArray);
		},
		insertRow : function (numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				if (($.isArray(numOfRowOrRowArray) && numOfRowOrRowArray.length > 0) || ($.isNumeric(numOfRowOrRowArray) && numOfRowOrRowArray > 0)) {
					// Define variables
					var tbWhole = this[0];
					insertResult = insertRow(tbWhole, numOfRowOrRowArray, rowIndex, callerUniqueIndex);
					// Reorder sequence as needed
					if ($.isNumeric(rowIndex) || $.isNumeric(callerUniqueIndex)) {
						// Sort sequence
						sortSequence(tbWhole, insertResult.rowIndex);
						// Move focus
						var insertUniqueIndex = settings._rowOrder[insertResult.addedRows[0]];
						$('#' + settings.idPrefix + '_Insert_' + insertUniqueIndex, tbWhole).focus();
					}
				}
			}
			return this;
		},
		removeRow : function (rowIndex, uniqueIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings && settings._rowOrder.length > 0) {
				removeRow(this[0], rowIndex, uniqueIndex, true);
			}
			return this;
		},
		emptyGrid : function () {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				emptyGrid(this[0]);
			}
			return target;
		},
		showColumn : function (name) {
			var settings = checkGridAndGetSettings(this);
			if (settings && name) {
				// Find column index
				var colIndex = -1,
				tbWhole = this[0];
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name == name) {
						colIndex = z;
						break;
					}
				}
				// Make sure the column exist and show the column if it is invisible only
				if (colIndex != -1 && settings.columns[colIndex].invisible) {
					// Change caption and footer column span
					settings._visibleCount++;
					settings._finalColSpan++;
					$('#' + settings.idPrefix + '_caption_td').attr('colSpan', settings._finalColSpan);
					$('#' + settings.idPrefix + '_footer_td').attr('colSpan', settings._finalColSpan);
					// Remove invisible class on each row
					$('#' + settings.idPrefix + '_' + name + '_td_head').removeClass('invisible');
					for (var z = 0; z < settings._rowOrder.length; z++) {
						var uniqueIndex = settings._rowOrder[z];
						$('#' + settings.idPrefix + '_' + name + '_td_' + uniqueIndex).removeClass('invisible');
						if (settings.useSubPanel) {
							$('#' + settings.idPrefix + '_SubRow_' + uniqueIndex).attr('colSpan', settings._visibleCount + (settings._hideLastColumn ? 0 : 1));
						}
					}
					// Save changes
					settings.columns[colIndex].invisible = false;
					saveSetting(tbWhole, settings);
				}
			}
			return this;
		},
		hideColumn : function (name) {
			var settings = checkGridAndGetSettings(this);
			if (settings && name) {
				// Find column index
				var colIndex = -1,
				tbWhole = this[0];
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name == name) {
						colIndex = z;
						break;
					}
				}
				// Make sure the column exist and hide the column if it is visible only
				if (colIndex != -1 && !settings.columns[colIndex].invisible) {
					// Change caption and footer column span
					settings._visibleCount--;
					settings._finalColSpan--;
					$('#' + settings.idPrefix + '_caption_td').attr('colSpan', settings._finalColSpan);
					$('#' + settings.idPrefix + '_footer_td').attr('colSpan', settings._finalColSpan);
					// Add invisible class on each row
					$('#' + settings.idPrefix + '_' + name + '_td_head').addClass('invisible');
					for (var z = 0; z < settings._rowOrder.length; z++) {
						var uniqueIndex = settings._rowOrder[z];
						$('#' + settings.idPrefix + '_' + name + '_td_' + uniqueIndex).addClass('invisible');
						if (settings.useSubPanel) {
							$('#' + settings.idPrefix + '_SubRow_' + uniqueIndex).attr('colSpan', settings._visibleCount + (settings._hideLastColumn ? 0 : 1));
						}
					}
					// Save changes
					settings.columns[colIndex].invisible = true;
					saveSetting(tbWhole, settings);
				}
			}
			return this;
		},
		isColumnInvisible : function (name) {
			var settings = checkGridAndGetSettings(this);
			if (settings && name) {
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name == name) {
						return settings.columns[z].invisible;
					}
				}
			}
			return null;
		},
		getRowCount : function () {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				return settings._rowOrder.length;
			}
			return null;
		},
		getUniqueIndex : function (rowIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings && $.isNumeric(rowIndex) && rowIndex < settings._rowOrder.length) {
				return settings._rowOrder[rowIndex];
			}
			return null;
		},
		getRowIndex : function (uniqueIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings && $.isNumeric(uniqueIndex)) {
				for (var z = 0; z < settings._rowOrder.length; z++) {
					if (settings._rowOrder[z] == uniqueIndex) {
						return z;
					}
				}
			}
			return null;
		},
		getRowValue : function (rowIndex, uniqueIndex, loopIndex) {
			var settings = checkGridAndGetSettings(this),
			result = null;
			if (settings) {
				if ($.isNumeric(rowIndex) && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
					uniqueIndex = settings._rowOrder[rowIndex];
				}
				if (!isEmpty(uniqueIndex)) {
					result = getRowValue(settings, uniqueIndex, loopIndex);
				}
			}
			return result;
		},
		getAllValue : function (objectMode) {
			var settings = checkGridAndGetSettings(this),
			result = null;
			if (settings) {
				// Prepare result based on objectMode setting
				result = objectMode ? {}

				 : [];
				// Process on each rows
				for (var z = 0; z < settings._rowOrder.length; z++) {
					if (objectMode) {
						rowValue = getRowValue(settings, settings._rowOrder[z], z);
						$.extend(result, rowValue)
					} else {
						rowValue = getRowValue(settings, settings._rowOrder[z]);
						result.push(rowValue);
					}
				}
				if (objectMode) {
					result[settings.rowCountName] = settings._rowOrder.length;
				}
			}
			return result;
		},
		getCtrlValue : function (name, rowIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name === name) {
						return getCtrlValue(settings, z, settings._rowOrder[rowIndex]);
					}
				}
			}
			return null;
		},
		setCtrlValue : function (name, rowIndex, value) {
			var settings = checkGridAndGetSettings(this);
			if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name == name) {
						setCtrlValue(settings, z, settings._rowOrder[rowIndex], value);
						break;
					}
				}
			}
			return this;
		},
		getCellCtrl : function (name, rowIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings && rowIndex >= 0 && rowIndex < settings._rowOrder.length) {
				var uniqueIndex = settings._rowOrder[rowIndex];
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name === name) {
						return getCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex);
					}
				}
			}
			return null;
		},
		getCellCtrlByUniqueIndex : function (name, uniqueIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				for (var z = 0; z < settings.columns.length; z++) {
					if (settings.columns[z].name === name) {
						return getCellCtrl(settings.columns[z].type, settings.idPrefix, name, uniqueIndex);
					}
				}
			}
			return null;
		},
		getRowOrder : function () {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				// Return a copy of `Row Order` array
				return settings._rowOrder.slice();
			}
			return null;
		},
		getColumns : function () {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				// Return a copy of the columns array
				return settings.columns.slice();
			}
			return null;
		},
		isRowEmpty : function (rowIndex) {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				return isRowEmpty(settings, rowIndex);
			}
			return null;
		},
		removeEmptyRows : function () {
			var settings = checkGridAndGetSettings(this);
			if (settings) {
				var tbWhole = this[0];
				for (var z = settings._rowOrder.length; z >= 0; z--) {
					if (isRowEmpty(settings, z)) {
						// Remove itself
						removeRow(tbWhole, null, settings._rowOrder[z], true);
					}
				}
				return this;
			}
			return null;
		}
	};
	function checkGridAndGetSettings(grid, noMsg) {
		// Check the jQuery grid object is initialized and return its settings
		var settings = null;
		if (grid.length == 1) {
			settings = grid.data('pearlSaleTable');
			if (!settings && !noMsg) {
				alert(_systemMessages.notInit);
			}
		} else if (!noMsg) {
			alert(_systemMessages.getValueMultiGrid);
		}
		return settings;
	}

	var _tableCellContentFactory = {
		"checkbox" : createCheckbox,
		"text" : createLabel,
		"select" : createSelect,
		"input" : createInput
	};

	function createTableCellContent(tbCell, type, id, name, cssClass, cssAttribute, data, context) {
		var t = type;
		if (isEmpty(_tableCellContentFactory[t])) {
			t = 'text';
		}
		var ctrl = _tableCellContentFactory[t](tbCell, id, name, data, context);

		if (!isEmpty(cssClass)) {
			$(ctrl).addClass(cssClass)
		}

		if (!isEmpty(cssAttribute)) {
			$(ctrl).attr(cssAttribute);
		}
	}

	function createCheckbox(tbCell, id, name, data, context) {
		var template = $.validator.format(
				"<input type='checkbox' name={0} id={1} data-theme='b'/>");
		var ctrl = $(template(name, id)).appendTo(tbCell);
		$(tbCell).trigger('create');
		return ctrl;
	}
	function createLabel(tbCell, id, name, data, context) {
		var template = $.validator.format("<div><span id={0} name={1}> </span></div>");
		var ctrl = $(template(id, name)).appendTo(tbCell).css({
				'textAlign' : 'center'
			});
		return ctrl;
	}
	function createSelect(tbCell, id, name, data, context) {
		var selectTemplate = $.validator.format(
				'<select name={0} id={1}></select>');
		var ctrl = $(selectTemplate(name, id)).appendTo(tbCell);
		var optionTemplate = $.validator.format('<option value={0}>{1}</option>');
		data.options.forEach(function (entry) {
			$(optionTemplate(entry.value, entry.display)).appendTo(ctrl);
		})
		$(tbCell).trigger('create');
		return ctrl;
	}

	function createInput(tbCell, id, name, data, context) {
		var inputTemplate = $.validator.format("<input type='text' name={0} id={1} data-clear-btn='true' />");
		var ctrl = $(inputTemplate(name, id)).appendTo(tbCell);
		$(tbCell).trigger('create');
		return ctrl;
	}

	function createListview(tbCell, data) {
		var listViewHeader = $("<div></div>").appendTo(tbCell);
		listViewHeader.addClass('my-page').attr({
			'data-role' : 'collapsibleset',
			'data-iconpos' : 'right',
			'data-content-theme' : 'a'
		});
		var listView = $('<div></div>').appendTo(listViewHeader);
		listView.attr({
			'data-role' : 'collapsible',
			'data-collapsed' : 'true'
		});
		$('<h2>section 1</h2>').appendTo(listView);
		var ul = $('<ul></ul>').appendTo(listView);
		ul.attr({
			'data-role' : 'listview',
			'data-inset' : 'true'
		});
		for (var i = 0; i < 6; i++) {
			var li = $("<li><a href='#'></a></li>").appendTo(ul);
			$("<img class='ui-li-thumb' src='img/coach.png'>").appendTo(li);
			$("<h2>Coach F21567</h2>").appendTo(li);
			$("<p>Color Red</p>").appendTo(li);
			$("<p class='ui-li-aside'>3</p>").appendTo(li);
		}

		$(tbCell).trigger('create');
		return listViewHeader;
	}

	// rowIndex specifies the row to be operated.
	// callerUniqueIndex specifies the index of row corresponding data in data set.
	function insertRow(tbWhole, numOfRowOrRowArray, rowIndex, callerUniqueIndex) {
		// Define variables
		var settings = $(tbWhole).data('pearlSaleTable');
		var addedRows = [],
		parentIndex = null,
		uniqueIndex,
		ctrl,
		hidden = [];
		var tbHead = tbWhole.getElementsByTagName('thead')[0];
		var tbBody = tbWhole.getElementsByTagName('tbody')[0];
		var tbRow,
		tbSubRow = null,
		tbCell;
		// Check number of row to be inserted
		var numOfRow = numOfRowOrRowArray,

		// Control data loading after a new row is created.
		loadData = false;

		if ($.isArray(numOfRowOrRowArray)) {
			numOfRow = numOfRowOrRowArray.length;
			loadData = true;
		}
		// Check parent row @todo what's purpose
		if ($.isNumeric(callerUniqueIndex)) {
			for (var z = 0; z < settings._rowOrder.length; z++) {
				if (settings._rowOrder[z] == callerUniqueIndex) {
					rowIndex = z;
					if (z != 0)
						parentIndex = z - 1;
					break;
				}
			}
		} else if ($.isNumeric(rowIndex)) {
			if (rowIndex >= settings._rowOrder.length) {
				rowIndex = null;
			} else {
				parentIndex = rowIndex - 1;
			}
		} else if (settings._rowOrder.length != 0) {
			rowIndex = null;
			parentIndex = settings._rowOrder.length - 1;
		}
		// Remove empty row
		if (settings._rowOrder.length == 0) {
			$('tr.empty', tbWhole).remove();
		}

		// Add total number of row
		for (var z = 0; z < numOfRow; z++) {
			// Update variables
			settings._uniqueIndex++;
			uniqueIndex = settings._uniqueIndex;
			hidden.length = 0;
			// Check row insert index
			if ($.isNumeric(rowIndex)) {
				settings._rowOrder.splice(rowIndex, 0, uniqueIndex);
				if (settings.useSubPanel) {
					tbBody.insertBefore(tbSubRow = document.createElement('tr'), tbBody.childNodes[rowIndex * 2]);
					tbBody.insertBefore(tbRow = document.createElement('tr'), tbBody.childNodes[rowIndex * 2]);
				} else {
					tbBody.insertBefore(tbRow = document.createElement('tr'), tbBody.childNodes[rowIndex]);
				}
				addedRows.push(rowIndex);
			} else {
				settings._rowOrder.push(uniqueIndex);
				tbBody.appendChild(tbRow = document.createElement('tr'));
				if (settings.useSubPanel) {
					tbBody.appendChild(tbSubRow = document.createElement('tr'));
				}
				addedRows.push(settings._rowOrder.length - 1);
			}

			tbRow.id = settings.idPrefix + '_Row_' + uniqueIndex;
			if (settings._sectionClasses.body) {
				tbRow.className = settings._sectionClasses.body;
			}

			$(tbRow).data('pearlSaleTable', uniqueIndex);
			// Config on the sub panel row
			if (tbSubRow != null) {
				tbSubRow.id = settings.idPrefix + '_SubRow_' + uniqueIndex;
				$(tbSubRow).data('pearlSaleTable', uniqueIndex);
				if (settings._sectionClasses.subPanel) {
					tbSubRow.className = settings._sectionClasses.subPanel;
				}
			}

			// Add row number
			if (!settings.hideRowNumColumn) {
				var ctrlId = settings.idPrefix + '_NO_' + uniqueIndex;
				createTableCellContent(tbCell = $('<td></td>').appendTo(tbRow), 'text', ctrlId, ctrlId, null, null, null);
				$('#' + ctrlId, tbBody).text(settings._rowOrder.length);
				$(tbCell).appendTo(tbRow);
				if (settings.useSubPanel)
					tbCell.rowSpan = 2;
			}

			// Process on each columns
			for (var y = 0; y < settings.columns.length; y++) {
				// Skip hidden
				if (settings.columns[y].type == 'hidden') {
					hidden.push(y);
					continue;
				}
				// Check column invisble
				var className = 'ui-widget-content';
				if (settings.columns[y].invisible)
					className += ' invisible';

				var tbCell = $("<td></td>").appendTo(tbRow);

				var ctrlId = settings.idPrefix + '_' + settings.columns[y].name + '_' + uniqueIndex;
				var ctrlName = ctrlId;
				var ctrlType = settings.columns[y].type;
				createTableCellContent(tbCell, ctrlType, ctrlId, ctrlId, null, null, {
					value : 'a',
					options : [{
							value : 'CH',
							display : 'Coach'
						}, {
							value : 'KS',
							display : 'Kate Spade'
						}
					]
				});

				if (loadData) {
					// Load data if needed
					setCtrlValue(settings, y, uniqueIndex, numOfRowOrRowArray[z][settings.columns[y].name]);
				} else if (!isEmpty(settings.columns[y].value)) {
					// Set default value
					setCtrlValue(settings, y, uniqueIndex, settings.columns[y].value);
				}

			}

			if (!settings._hideLastColumn) {
				var tbCell = $("<td></td>").appendTo(tbRow);
				var ctrlId = settings.idPrefix + '_CtrlGroup_' + uniqueIndex;

				var groupTemplate = $.validator.format("<div data-role='controlgroup' id={0} name={1} data-type='horizontal'></div>");
				var group = $(groupTemplate(ctrlId, ctrlId)).appendTo(tbCell);
				var btnTemplate = $.validator.format("<a class='ui-btn ui-corner-all {0} ui-btn-icon-notext' id={1} name={2} href='#' />");
				settings.customRowButtons.forEach(function (entry) {
					var buttonId = ctrlId + '_' + entry;
					$(btnTemplate(_defaultButtonResource[entry].icon, buttonId, buttonId)).appendTo(group).click(_defaultButtonResource[entry].onClick(tbWhole)).data('appendGrid', {
						uniqueIndex : uniqueIndex
					});
				});

				$(tbCell).trigger('create');
			}
			// Create sub panel
			if (settings.useSubPanel) {
				tbSubRow.appendChild(tbCell = document.createElement('td'));
				tbCell.colSpan = settings._visibleCount + (settings._hideLastColumn ? 0 : 1);
				createListview(tbCell, null);

			}
		}
		// Save setting
		saveSetting(tbWhole, settings);
		// Trigger events
		if ($.isNumeric(rowIndex)) {
			if ($.isFunction(settings.afterRowInserted)) {
				settings.afterRowInserted(tbWhole, parentIndex, addedRows);
			}
		} else {
			if ($.isFunction(settings.afterRowAppended)) {
				settings.afterRowAppended(tbWhole, parentIndex, addedRows);
			}
		}
		// Return added rows' uniqueIndex
		return {
			addedRows : addedRows,
			parentIndex : parentIndex,
			rowIndex : rowIndex
		};
	}

	function removeRow(tbWhole, rowIndex, uniqueIndex, force) {
		var settings = $(tbWhole).data('pearlSaleTable');
		var tbBody = tbWhole.getElementsByTagName('tbody')[0];
		if ($.isNumeric(uniqueIndex)) {
			for (var z = 0; z < settings._rowOrder.length; z++) {
				if (settings._rowOrder[z] == uniqueIndex) {
					rowIndex = z;
					break;
				}
			}
		}
		if ($.isNumeric(rowIndex)) {
			// Remove middle row
			if (force || typeof(settings.beforeRowRemove) != 'function' || settings.beforeRowRemove(tbWhole, rowIndex)) {
				settings._rowOrder.splice(rowIndex, 1);
				if (settings.useSubPanel) {
					tbBody.removeChild(tbBody.childNodes[rowIndex * 2]);
					tbBody.removeChild(tbBody.childNodes[rowIndex * 2]);
				} else {
					tbBody.removeChild(tbBody.childNodes[rowIndex]);
				}
				// Save setting
				saveSetting(tbWhole, settings);
				// Sort sequence
				sortSequence(tbWhole, rowIndex);
				// Trigger event
				if ($.isFunction(settings.afterRowRemoved)) {
					settings.afterRowRemoved(tbWhole, rowIndex);
				}
			}
		} else {
			// Remove last row
			if (force || !$.isFunction(settings.beforeRowRemove) || settings.beforeRowRemove(tbWhole, settings._rowOrder.length - 1)) {
				uniqueIndex = settings._rowOrder.pop();
				// tbBody.deleteRow(-1);
				tbBody.removeChild(tbBody.lastChild);
				if (settings.useSubPanel) {
					tbBody.removeChild(tbBody.lastChild);
				}
				// Save setting
				saveSetting(tbWhole, settings);
				// Trigger event
				if ($.isFunction(settings.afterRowRemoved)) {
					settings.afterRowRemoved(tbWhole, null);
				}
			}
		}
		// Add empty row
		if (settings._rowOrder.length == 0) {
			var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
			$('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
		}
	}
	function emptyGrid(tbWhole) {
		// Load settings
		var settings = $(tbWhole).data('pearlSaleTable');
		// Remove rows
		$('tbody', tbWhole).empty();
		settings._rowOrder.length = 0;
		settings._uniqueIndex = 0;
		// Save setting
		saveSetting(tbWhole, settings);
		// Add empty row
		if (settings._rowOrder.length == 0) {
			var empty = $('<td></td>').text(settings._i18n.rowEmpty).attr('colspan', settings._finalColSpan);
			$('tbody', tbWhole).append($('<tr></tr>').addClass('empty').append(empty));
		}
	}
	function sortSequence(tbWhole, startIndex) {
		var settings = $(tbWhole).data('pearlSaleTable');
		if (!settings.hideRowNumColumn) {
			for (var z = startIndex; z < settings._rowOrder.length; z++) {			
				$('#' + settings.idPrefix + '_NO_' + settings._rowOrder[z], tbWhole).text(z + 1);
			}
		}
	}
	function loadData(tbWhole, records, isInit) {
		var tbBody,
		tbRow,
		tbCell,
		uniqueIndex,
		insertResult;
		var settings = $(tbWhole).data('pearlSaleTable');
		if (settings) {
			// Clear existing content
			tbBody = tbWhole.getElementsByTagName('tbody')[0];
			$(tbBody).empty();
			settings._rowOrder.length = 0;
			settings._uniqueIndex = 0;
			// Check any records
			if (records != null && records.length) {
				// Add rows
				insertResult = insertRow(tbWhole, records, null, null);
			}
			// Save setting
			settings._isDataLoaded = true;
			if (isInit)
				settings.initData = null;
			$(tbWhole).data('pearlSaleTable', settings);
			// Trigger data loaded event
			if ($.isFunction(settings.dataLoaded)) {
				settings.dataLoaded(tbWhole, records);
			}
		}
	}
	function findRowIndex(uniqueIndex, settings) {
		for (var z = 0; z < settings._rowOrder.length; z++) {
			if (settings._rowOrder[z] == uniqueIndex) {
				return z;
			}
		}
		return null;
	}
	function isEmpty(value) {
		return typeof(value) == 'undefined' || value == null;
	}
	function getObjValue(obj, key) {
		if (!isEmpty(obj) && $.isPlainObject(obj) && !isEmpty(obj[key])) {
			return obj[key];
		}
		return null;
	}
	function saveSetting(tbWhole, settings) {
		$(tbWhole).data('pearlSaleTable', settings);
		$('#' + settings.idPrefix + '_rowOrder', tbWhole).val(settings._rowOrder.join());
	}
	function getRowIndex(settings, uniqueIndex) {
		var rowIndex = null;
		for (var z = 0; z < settings._rowOrder.length; z++) {
			if (settings._rowOrder[z] == uniqueIndex) {
				return z;
			}
		}
		return rowIndex;
	}
	function getRowValue(settings, uniqueIndex, loopIndex) {
		var result = {},
		keyName = null,
		suffix = (isEmpty(loopIndex) ? '' : '_' + loopIndex);
		for (var z = 0; z < settings.columns.length; z++) {
			keyName = settings.columns[z].name + suffix;
			result[keyName] = getCtrlValue(settings, z, uniqueIndex);
		}
		// Merge control values from sub panel if getter method defined
		if (settings.useSubPanel && $.isFunction(settings.subPanelGetter)) {
			var adtData = settings.subPanelGetter(uniqueIndex);
			if ($.isPlainObject(adtData)) {
				if (suffix == '') {
					// Extend to row data directly for array mode
					$.extend(result, adtData);
				} else {
					// For returning values in object mode, add suffix to all keys
					var newData = {};
					for (var key in adtData) {
						newData[key + suffix] = adtData[key];
					}
					$.extend(result, newData);
				}
			}
		}
		return result;
	}
	function getCtrlValue(settings, colIndex, uniqueIndex) {
		var ctrl = null,
		type = settings.columns[colIndex].type,
		columnName = settings.columns[colIndex].name;
		if (type == 'checkbox') {
			ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
			if (ctrl == null)
				return null;
			else
				return ctrl.checked ? 1 : 0;
		} else if (type == 'custom') {
			if ($.isFunction(settings.columns[colIndex].customGetter))
				return settings.columns[colIndex].customGetter(settings.idPrefix, columnName, uniqueIndex);
			else
				return null;
		} else {
			ctrl = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
			if (ctrl == null)
				return null;
			else
				return ctrl.value;
		}
	}
	function getCellCtrl(type, idPrefix, columnName, uniqueIndex) {
		return document.getElementById(idPrefix + '_' + columnName + '_' + uniqueIndex);
	}
	function setCtrlValue(settings, colIndex, uniqueIndex, data) {
		var type = settings.columns[colIndex].type;
		var columnName = settings.columns[colIndex].name;
		if (type == 'checkbox') {
			getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).checked = (data != null && data != 0);
		} else if (type == 'custom') {
			if ($.isFunction(settings.columns[colIndex].customSetter)) {
				settings.columns[colIndex].customSetter(settings.idPrefix, columnName, uniqueIndex, data);
			}
		} else if (type == 'select') {
			var menu = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
			menu.value = (data == null ? '' : data);
			$(menu).selectmenu('refresh');
		} else if (type == 'text') {
			var label = getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex);
			$(label).text(data);
		} else {
			getCellCtrl(type, settings.idPrefix, columnName, uniqueIndex).value = (data == null ? '' : data);
		}
	}
	function gridRowDragged(tbWhole, isMoveUp, uniqueIndex, tbRowIndex) {
		// Get setting
		var settings = $(tbWhole).data('pearlSaleTable');
		// Find the start sorting index
		var startIndex = -1;
		for (var z = 0; z < settings._rowOrder.length; z++) {
			if (settings._rowOrder[z] == uniqueIndex) {
				if (isMoveUp) {
					startIndex = tbRowIndex;
					settings._rowOrder.splice(z, 1);
					settings._rowOrder.splice(tbRowIndex, 0, uniqueIndex);
				} else {
					startIndex = z;
					settings._rowOrder.splice(tbRowIndex + 1, 0, uniqueIndex);
					settings._rowOrder.splice(z, 1);
				}
				break;
			}
		}
		// Do re-order
		sortSequence(tbWhole, startIndex);
		// Save setting
		saveSetting(tbWhole, settings);

		// Trigger event
		if ($.isFunction(settings.afterRowDragged)) {
			settings.afterRowDragged(tbWhole, tbRowIndex);
		}
	}
	function createGridButton(param, uiIcon) {
		// Generate the standard grid action button based on its parameter.
		var genButton = null;
		if (param) {
			if ($.isFunction(param)) {
				// Generate button if it is a function.
				genButton = $(param());
			} else if (param.nodeType) {
				// Clone the button if it is a DOM element.
				genButton = $(param).clone();
			} else if (param.icons) {
				// Generate jQuery UI Button if it is a plain object with `icons` property.
				genButton = $('<button/>').attr({
						type : 'button'
					}).button(param);
			}
		}
		if (!genButton) {
			// Use default setting (jQuery UI Button) if button is not created.
			genButton = $('<button/>').attr({
					type : 'button'
				}).button({
					icons : {
						primary : uiIcon
					},
					text : false
				});
		}
		return genButton;
	}
	function isRowEmpty(settings, rowIndex) {
		for (var z = 0; z < settings.columns.length; z++) {
			var uniqueIndex = settings._rowOrder[rowIndex];
			var currentValue = getCtrlValue(settings, z, uniqueIndex);
			// Check the empty criteria is function
			if ($.isFunction(settings.columns[z].emptyCriteria)) {
				if (!settings.columns[z].emptyCriteria(currentValue)) {
					return false;
				}
			} else {
				// Find the default value
				var defaultValue = null;
				if (!isEmpty(settings.columns[z].emptyCriteria)) {
					defaultValue = settings.columns[z].emptyCriteria;
				} else {
					// Check default value based on its type
					if (settings.columns[z].type == 'checkbox') {
						defaultValue = 0;
					} else if (settings.columns[z].type == 'select' || settings.columns[z].type == 'ui-selectmenu') {
						var options = getCellCtrl(settings.columns[z].type, settings.idPrefix, settings.columns[z].name, uniqueIndex).options;
						if (options.length > 0) {
							defaultValue = options[0].value;
						} else {
							defaultValue = '';
						}
					} else {
						defaultValue = '';
					}
				}
				// Compare with the default value
				if (currentValue != defaultValue) {
					return false;
				}
			}
		}
		return true;
	}
	/// <summary>
	/// Initialize append grid or calling its methods.
	/// </summary>
	$.fn.pearlSaleTable = function (params) {
		if (_methods[params]) {
			return _methods[params].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof(params) === 'object' || !params) {
			return _methods.init.apply(this, arguments);
		} else {
			alert(_systemMessages.notSupportMethod + params);
		}
	};
})(jQuery);
