'use strict';

var reportApp = angular.module('reportApp', []);

// reportApp.controller('reportApp', ['$scope', '$routeParams',
//     function ($scope, $routeParams) {
//         $scope.openTab = {};
//         if ($routeParams.key) {
//             $scope.openTab[$routeParams.key] = true;
//         } 

//         $scope.changeTab = function (tabName) {
//             $scope.openTab[tabName] = true;
//         }
//     }
// ])

//Controller 
reportApp.controller('reportViewerController', ['$scope', '$log', '$location', '$filter', '$timeout', '$q', '$rootScope', '$routeParams', 'NgTableParams', 'messageService', 'userService', 'exportService', 'reportsService', 'dialogService', 'utilityService', 'environment',
	function ($scope, $log, $location, $filter, $timeout, $q, $rootScope, $routeParams, NgTableParams, messageService, userService, exportService, reportsService, dialogService, utilityService, environment) {
		$scope.betaOnly = function () {
			if (environment.mode == 'beta' || environment.mode == 'local')
				return true;
			else
				return false;
		};
		$scope.backToHomeScreen = function () {
			$location.path('/home');

		}
		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};
		//validations for controller end

		//Object holding timeout for search field
		var filterTimeout = {};
		//Holds current report data. this array is useful when we want to filter the grid's data. as we won't manipulate the scope array.
		var currentReportData = [];
		//holds grid configuration. keep it undefined otherwise u'll have to use k-delay for gridConfiguration
		$scope.gridConfiguration;
		var pageSize = 10;//keeps the current size of grid.

		//decides the page look while exporting pdf.
		var _formatPDFPage = function (e) {
			// Import Drawing API namespaces
			var draw = kendo.drawing;
			var geom = kendo.geometry;
			// A4 Sheet with 1 cm borders,
			var PAGE_RECT = new geom.Rect([0, 0], [840, 595]);
			// Spacing between header, content and footer
			var LINE_SPACING = 25;
			var header = new kendo.drawing.Text($scope.selectedReport.title, [45, 10], { font: 14 + "px 'DejaVu Sans'" });
			var content = e.page;

			// Remove header, footer and spacers from the page size
			var contentRect = PAGE_RECT.clone();
			contentRect.size.height -= 1 * header.bbox().height() + 2 * LINE_SPACING;
			contentRect.size.width = 800;
			// Fit the content in the available space
			draw.fit(content, contentRect);

			// Do a final layout with content
			var page = new draw.Layout(PAGE_RECT, {
				orientation: "vertical", // "Rows" go below each other
				spacing: LINE_SPACING   // Leave spacing between rows
			});
			page.append(header, content);
			page.reflow();
			return page;
		};

		var tabHandler = function () {
			var location = $location.path();
			$scope.openTab = [false, false, false, false];
			$scope.currentOpenTab = 0;
			if (location.indexOf('/clientListingReports') > -1) {
				$scope.currentOpenTab = 2;
				// $scope.openTab[2] = true;
				$scope.openTab[$scope.currentOpenTab] = true;
			} else if (location.indexOf('/viteReport') > -1) {
				$scope.currentOpenTab = 3;
				// $scope.openTab[3] = true;
				$scope.openTab[$scope.currentOpenTab] = true
			} else if (location.indexOf('/returnStatusReport') > -1) {
				$scope.currentOpenTab = 1;
				//	$scope.openTab[1] = true;
				$scope.openTab[$scope.currentOpenTab] = true
			} else {
				$scope.currentOpenTab = 0;
				// $scope.openTab[0] = true;
				$scope.openTab[$scope.currentOpenTab] = true
			}


		}
		//initialize function
		var _init = function () {


			//getGrid Configurations from server.
			reportsService.getReportConfigurations().then(function (response) {
				$scope.gridConfiguration = response;
				// pdf export listener.. it will evaulate on progress as well as on pdf done..
				$scope.gridConfiguration.pdfExport = function (e) {
					var grid = angular.element(document.getElementById("reportGrid"));
					e.promise.progress(function (e) {
						//we have to hide progress bar on exporting pdf. so we add following class.
						angular.element(grid.children()[2]).addClass("no-loading");
						e.page = _formatPDFPage(e);
					}).done(function () {
						//On pdf export done we need to restore the pageSize to pageSize
						$scope.reportGrid.dataSource.pageSize(pageSize);
						//We need to remove classes which we have inserted before export.
						$scope.reportGrid.wrapper.height("").css("overflow", "")
							.children(".k-grid-pager").css({ position: "", bottom: "auto", left: "auto", width: "" });

						//As we hide progress bar on exporting pdf, we need to remove relevant class on process completed.
						angular.element(grid.children()[2]).removeClass("no-loading");
						// broadcasting progress completed.. Must to close the wait dialog.
						$rootScope.$broadcast("exportPDFCompleted");
					});
				};
			}, function (error) {
				$log.error(error);
			});

			//# Top dropdown ng-table	
			//Following object holds ng-table's configurations and initialize-filter data for grid.	
			$scope.reportListGrid = new NgTableParams({
				page: 1, // show initial page
				count: 5000,// count per page
				sorting: {
					// initial sorting
					reportName: 'asc'
				}
			},
				{
					total: 0, // length of data
					counts: [],
					sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
					getData: function ($defer, params) {
						// Request to API
						// get Data here				
						if (angular.isUndefined($scope.reportList)) {
							//load list from API
							reportsService.getReportList().then(function (response) {
								$scope.reportList = response;
								// loadReport()
								//load the first report

								$scope.loadReport($scope.reportList[$scope.currentOpenTab], true);
								// Only On successful API response we bind data to grid.			
								var filteredData = $scope.reportList;
								//Apply standard sorting
								var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
								params.total(filteredData.length);
								//Return Result to grid
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							}, function (error) {
								$log.error(error);
							});
						} else {
							var filteredData = $scope.reportList;
							//Apply standard sorting
							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
							params.total(filteredData.length);
							//Return Result to grid
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					}
				});
			//# Top dropdown ng-table

			//# Report - kendo grid
			//Note: We have used transport-> read, to have loading indicator while data is getting load. Otherwise it is not required to do this way.
			//We can set like $scope.reportData.data(response);
			$scope.reportData = new kendo.data.DataSource({
				type: "odata",
				transport: {
					read: function (options) {
						//Load report data
						reportsService.getReportData($scope.selectedReport.type).then(function (response) {
							if ($scope.selectedReport.type === 'returnstatus') {
								for (var index in response) {
									if (response[index].returnStatus) {
										var returnStatusTitle = response[index].returnStatus.title
										response[index].returnStatus = returnStatusTitle;
									}
								}
							}
							currentReportData = response;
							options.success(response);
							//apply sorting
							applyInitialSorting();
						}, function (error) {
							options.error(error);
						});
					}
				},
				pageSize: 10,
				requestStart: function (e) {
					_addPagerClass(e);
					$scope.enableLoading = true;
				},
				requestEnd: function (e) {
					_removePagerClass(e);
					$scope.enableLoading = false;
				}
			});
			tabHandler();
		};

		//function adds classes that set min height and move pager to specific position.
		var _addPagerClass = function (e) {
			//We get grid and pager's element.
			//We have to get this elements here because at beginning both elements will not be available.
			var grid = angular.element(document.getElementById("reportGrid"));
			var pager = angular.element(document.getElementsByClassName("k-grid-pager")[0]);

			//we add classes to set height and move pager down
			if (!_.isUndefined(grid)) {
				grid.addClass("setMinHeight");
			}

			if (!_.isUndefined(pager)) {
				pager.addClass("movePager");
			}
		};

		//function removes classes that set min height and move pager to specific position.
		var _removePagerClass = function (e) {
			//We get grid and pager's element.
			//We have to get this elements here because at beginning both elements will not be available.
			var grid = angular.element(document.getElementById("reportGrid"));
			var pager = angular.element(document.getElementsByClassName("k-grid-pager")[0]);
			//we remove classes to set height and move pager down
			if (!_.isUndefined(grid)) {
				grid.removeClass("setMinHeight");
			}

			if (!_.isUndefined(pager)) {
				pager.removeClass("movePager");
			}
		};

		//This function will used to apply initial sorting whenever reports get loaded
		var applyInitialSorting = function () {
			//check if column definitions are loaded or not
			if (!_.isUndefined($scope.currentReportDefinition)) {
				var _sort = [];
				//Loop through each columns to identify sorting
				_.forEach($scope.currentReportDefinition, function (columnObject, index) {
					if (!_.isUndefined(columnObject.sort)) {
						_sort.push({ field: columnObject.field, dir: columnObject.sort });
					}
				});
				//apply sorting to datasource
				if (!_.isEmpty(_sort) && $scope.reportGrid.dataSource.data().length > 0) {
					$scope.reportGrid.dataSource.sort(_sort);
				}
			}
		};

		//Load Report header and its data.
		//Pass isInitialLoad = true only IF we are coming to page for the first time.
		$scope.loadReport = function (report, isInitialLoad) {
			var location = $location.path();
			if (_.isUndefined($scope.selectedReport) || $scope.selectedReport.type != report.type) {

				//get selected report
				$scope.selectedReport = report;

				//IF initial call then no need to empty data or header defination.
				if (isInitialLoad != true) {
					//empty all data. This steps are necessary because IF we don't do this the field with the same name were not reloading with fresh data.
					//Example:- IF two report have ssn field then on change of report ssn field will have only first report's data. will not replace it with new data.
					if (!_.isUndefined($scope.reportGrid)) {
						currentReportData = [];
						//Note: Do not set page 1 if it is 0 else it will fire api call to load data. Issue of unnecessory inteligence in kendo.
						if ($scope.reportGrid.dataSource.page() > 1) {
							$scope.reportGrid.dataSource.page(1);
						}
						$scope.reportGrid.dataSource.data([]);
					}
					$scope.currentReportDefinition = [];
				}

				//get reportHeader from server    	
				reportsService.getReportHeader(report.type).then(function (response) {
					// add width of all header value for vita
					if ($scope.selectedReport.type == 'vita') {
						for (var i = 0; i < response.length; i++) {
							response[i].width = 150
						}
					}
					// we have to appdend table with div 
					setTimeout(function () {
						$('#reportTable').append($('table[role="grid"]'))
					}, 100);
					$scope.currentReportDefinition = response;
					/*if(!_.isUndefined($scope.reportGrid)){
						$scope.reportGrid.dataSource.read();
					}*/

				}, function (error) {
					$log.error(error);
				});
			}
		};


		//Following function will execute when user will reorder columns.
		$scope.columnReorder = function (e) {
			if (!_.isUndefined(e) && !_.isUndefined(e.oldIndex) && !_.isUndefined(e.newIndex)) {
				var definition = angular.copy($scope.currentReportDefinition);
				//store value to be changed temparary 
				var fieldToReorder = definition[e.oldIndex];
				//delete value from old index
				definition.splice(e.oldIndex, 1);
				//insert value at new index
				definition.splice(e.newIndex, 0, fieldToReorder);
				//save data 				
				reportsService.saveReportHeader($scope.selectedReport.type, definition);
			}
		};



		//Following function will execute when user will hide column.
		$scope.columnHide = function (e) {
			if (!_.isUndefined(e) && !_.isUndefined(e.column) && !_.isUndefined(e.column.field)) {
				//find field that has been hidden
				var definition = _.find($scope.currentReportDefinition, { "field": e.column.field });
				//set flag to true
				definition.hidden = true;
				//save data 				
				reportsService.saveReportHeader($scope.selectedReport.type, $scope.currentReportDefinition);
			}
		};

		//Following function will execute when user will hide column.
		$scope.columnShow = function (e) {
			if (!_.isUndefined(e) && !_.isUndefined(e.column) && !_.isUndefined(e.column.field)) {
				//find field that has been un-hide
				var definition = _.find($scope.currentReportDefinition, { "field": e.column.field });
				//set flag to False
				definition.hidden = false;
				//save data 				
				reportsService.saveReportHeader($scope.selectedReport.type, $scope.currentReportDefinition);
			}
		};

		//Watch for search field
		//only update data not page size.
		$scope.$watch('searchField', function (newVal, oldVal) {
			//If Grid data is defined and newval and old val is not same
			if (!_.isUndefined(currentReportData) && newVal != oldVal) {
				//Cancel old search filter
				$timeout.cancel(filterTimeout);
				//Register new timeout for filter
				filterTimeout = $timeout(function () {
					var filteredData = $filter('filter')(currentReportData, function (reportObj, index) {
						//flag checks whether any column has matching data.					
						var isMatched = false;
						//Loop through each data					
						_.forEach($scope.currentReportDefinition, function (column) {
							//convert data to lowercase then check wether it contains the search text.								
							if (!_.isUndefined(reportObj) && !_.isUndefined(reportObj[column.field]) && reportObj[column.field].toString().toLowerCase().indexOf(newVal.toString().toLowerCase()) > -1) {
								isMatched = true;
								return false;
							}
						});

						//IF column has matching data then return true else false...
						if (isMatched) {
							return true;
						}
						return false;
					});

					//Note: Do not set page 1 if it is 0 else it will fire api call to load data. Issue of unnecessory inteligence in kendo.
					if ($scope.reportGrid.dataSource.page() > 1) {
						$scope.reportGrid.dataSource.page(1);
					}
					//reload the grid with new data
					$scope.reportGrid.dataSource.data(filteredData);
				}, 300);
			}
		});

		$scope.clearSearch = function () {
			$scope.searchField = '';
		};
		/*
		 * Export section start here
		 * NOTE :- AS we wants to keep same format while exporting,
		 * 		   In excel we prepare rows and columns by our self. 
		 */
		$scope.exportList = function (type) {
			//prepares filename
			var fileName = $scope.selectedReport.title;

			//replace all blank spaces with '_'.
			if (!_.isUndefined(fileName)) {
				fileName = angular.copy(utilityService.removeSpaces($scope.selectedReport.title));
			} else {
				fileName = $scope.selectedReport.type;
			}

			if (type == "excel" || type == "csv") {
				var rows = [];
				//get grid's data..
				var data = $scope.reportGrid.dataSource.data();

				//prepare columns titles first and define columns's width ..
				var titles = [], columnsWidth = [];
				_.forEach($scope.currentReportDefinition, function (header) {
					var title = header.title == undefined ? "" : header.title;
					titles.push({ value: title, bold: true });
					columnsWidth.push({ autoWidth: true });
				});

				//push columns titles first and define columns's width ..
				rows.push({ cells: titles });

				//loop through each row of data..
				for (var row = 0; row < data.length; row++) {
					//cells array will contain the data for row to be exported.
					var cells = [];
					//loop through each columns
					for (var column = 0; column < $scope.currentReportDefinition.length; column++) {
						cells[column] = {};
						//IF column has template defined then get templated value. ELSE store values directly.
						if ($scope.currentReportDefinition[column].templateName) {
							cells[column].value = reportsService.getExcelValue($scope.currentReportDefinition[column].templateName, data[row][$scope.currentReportDefinition[column].field]);
						} else {
							cells[column].value = data[row][$scope.currentReportDefinition[column].field];
						}
					}
					//push cells array to row.
					rows.push({ cells: cells });
				}

				var numberOfColumns = $scope.currentReportDefinition.length == undefined || $scope.currentReportDefinition.length < 0 ? 0 : $scope.currentReportDefinition.length;

				//define work book. assign prepared rows to it.    		
				var workbook = new kendo.ooxml.Workbook({
					sheets: [{
						filter: { from: 0, to: numberOfColumns - 1 },
						columns: columnsWidth,
						title: angular.copy(utilityService.removeSpaces($scope.selectedReport.title)), //Title must not contain any spaces to apply filter properly. So we remove space from title.
						rows: rows
					}]
				});
				//save the file as Excel file with extension xlsx
				kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: fileName + ".xlsx" });
			} else if (type == "pdf") {
				//due to issue in dialogService we close.
				dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/report/partials/exportPDFDialog.html", "exportPDFDialogController");

				//IF we don't use timeout then UI freezes before showing dialog.
				$timeout(function () {
					$scope.reportGrid.setOptions({
						pdf: { allPages: true, fileName: fileName + ".pdf", paperSize: "A4", margin: "1cm", landscape: true }
					});

					//We have to inject following classes to stop grid to jump while we change the pageSize during export.
					//This class will set pager's position absolute so jump will be avoided and scroll is also hidden.
					$scope.reportGrid.wrapper.height($scope.reportGrid.wrapper.height()).css("overflow", "hidden")
						.children(".k-grid-pager").css({ position: "absolute", bottom: 0, left: 0, width: "100%" });

					//After injection classes we need to change pageSize to avoid jump. 
					//IF we do this before classes added then the grid will start jumping during export. 
					pageSize = $scope.reportGrid.dataSource.pageSize();
					$scope.reportGrid.dataSource.pageSize(15);
					$scope.reportGrid.saveAsPDF();
				}, 300);
			}
		};
		//Export section end here
		//# Report - kendo grid
		//Initialization
		_init();
	}]);

reportApp.controller("exportPDFDialogController", ['$scope', '$rootScope', '$modalStack', function ($scope, $rootScope, $modalStack) {
	//on export complete we need to close dialog.
	var exportCompleteListener = $rootScope.$on("exportPDFCompleted", function () {
		$modalStack.dismissAll("");
	});

	// deregister listener..
	$scope.$on("$destory", function () {
		exportCompleteListener();
	});
}]);


reportApp.service("reportsService", ['$q', '$http', '$filter', 'dataAPI', 'localStorageUtilityService', 'userService', function ($q, $http, $filter, dataAPI, localStorageUtilityService, userService) {
	var reportsService = {};
	//holds all report's header. keep it undefined otherwise it will not take any data from server.
	var reportDefinationList;



	//returns relevant template
	var _getTemplate = function (name, field) {
		var template = {
			"checkboxTemplate": function (dataItem) {
				if (!_.isUndefined(dataItem[field]) && dataItem[field].toString().toLowerCase() == "yes") {
					return '<img width="10" height="10" src="taxAppJs/home/images/check.png">';
				}
				//return '<img width="10" height="10" src="../home/images/uncheck.png">';
				return ""
			},
			"dateTemplate": function (dataItem) {
				if (!_.isUndefined(dataItem[field]) && dataItem[field] != "") {
					return $filter('date')(new Date(dataItem[field]), 'MM/dd/yyyy');
				}
				return "";
			},
			"ssnTemplate": function (dataItem) {
				if (!_.isUndefined(dataItem[field]) && dataItem[field] != "") {
					var tempData = angular.copy(dataItem[field]);
					return "<span>" + $filter('limitTo')(tempData, -4) + "</span>";
				}
				return "";
			},
			"returnStatus": function (dataItem) {
				if (!_.isUndefined(dataItem[field]) && dataItem[field] != "") {
					return userService.getReturnStatusObject(dataItem[field], undefined, true).title;
				}
				return "";
			}
		};

		return template[name];
	};

	//function replace column template string with template functions..
	var _getColumnTemplate = function (type) {
		if (!_.isUndefined(reportDefinationList[type])) {
			//we take temporary variable here to avoid two-way bindings.
			var reportHeaders = angular.copy(reportDefinationList[type].definition);
			//loop through each column check whether it hase template field as string. then replace string with column template.
			_.forEach(reportHeaders, function (column) {
				if (!_.isUndefined(column.templateName) && column.templateName != "" && _.isString(column.templateName)) {
					column.template = _getTemplate(column.templateName, column.field);
				}
			});
			return reportHeaders;
		}
	};

	/*
	 * Note:- excel templates.
	 * We have to take this template separately then available in _getTemplate() (returns html),
	 * because we needed plain string.
	 */
	reportsService.getExcelValue = function (template, value) {
		var excelTemplate = {
			"dateTemplate": function (value) {
				if (!_.isUndefined(value) && value != "") {
					return $filter('date')(new Date(value), 'MM/dd/yyyy');
				}
				return "";
			},
			"ssnTemplate": function (value) {
				if (!_.isUndefined(value) && value != "") {
					var tempData = angular.copy(value);
					return $filter('limitTo')(tempData, -4);
				}
				return "";
			},
			"returnStatus": function (value) {
				if (!_.isUndefined(value) && value != "") {
					return userService.getReturnStatusObject(value, undefined, true).title
				}
				return "";
			}
		};

		//As we don't won't to this changes modifies original datasource we have taken copy of the value.
		value = angular.copy(value);

		//IF template is defined then only return templated value.
		if (!_.isUndefined(excelTemplate[template])) {
			//returns templated value. First it excutes the function and then it returns modified the value.
			return excelTemplate[template](value);
		}

		return value;
	};

	//returns available report list..
	reportsService.getReportList = function ($scope) {
		var deffer = $q.defer();
		// add new option of vita report for beta only now

		var reportList = [{ "title": "Invoice Report", "description": "Displays clients paid in full/and or clients with an outstanding balance", type: "invoice" },
		{ "title": "Return Status Report", "description": "Displays clients return type, filing status, and e-file status", type: "returnstatus" },
		{ "title": "Client Listing", "description": "Displays clients mailing & e-mail address, and DOB", type: "clientlisting" },
		{ "title": "VITA Report", "description": "VITA Report", type: "vita" }
		];


		deffer.resolve(reportList);
		return deffer.promise;
	};

	//returns report configurations..
	reportsService.getReportConfigurations = function () {
		var deffer = $q.defer();
		var gridConfiguration = { sortable: true, filterable: true, reorderable: true, resizable: true, columnMenu: true, scrollable: false, pageable: { pageSizes: [10, 25, 50, 100], info: false } };
		deffer.resolve(gridConfiguration);
		return deffer.promise;
	};

	//returns relevant report header.
	reportsService.getReportHeader = function (type) {
		var deffer = $q.defer();

		//Get report header from server only IF reportDefinationList is undefined 
		if (_.isUndefined(reportDefinationList) || _.isEmpty(reportDefinationList)) {
			$http({ method: "post", url: dataAPI.base_url + "/report/definitions" }).then(function (response) {
				reportDefinationList = response.data.data;
				deffer.resolve(_getColumnTemplate(type));
			}, function (error) {
				deffer.reject(error);
			});
		} else {
			deffer.resolve(_getColumnTemplate(type));
		}

		return deffer.promise;
	};

	//returns relevant report data.
	reportsService.getReportData = function (type) {
		var deffer = $q.defer();

		$http({ method: "post", url: dataAPI.base_url + "/report/view", "data": { "reportName": type } }).then(function (response) {
			if (!_.isUndefined(response.data)) {
				//The following code is written to avoid printing 'undefined' in pdf is value is not defined.
				//Loop through each data
				_.forEach(response.data.data, function (reportObj) {
					//Loop through each column of the data..
					//Check whether it is undefined then assign blank.
					if (!_.isUndefined(reportDefinationList[type]) && !_.isUndefined(reportDefinationList[type].definition)) {
						_.forEach(reportDefinationList[type].definition, function (column) {
							if (_.isUndefined(reportObj[column.field])) {
								reportObj[column.field] = "";
							}
						});
					}
				});

				//resolve data.
				deffer.resolve(response.data.data);
			} else {
				deffer.resolve();
			}
		}, function (error) {
			deffer.reject(error);
		});

		return deffer.promise;
	};

	//saves the report headers. Happens when user reorder columns or show/hide a column etc.
	reportsService.saveReportHeader = function (type, reportDefinition) {
		var deffer = $q.defer();

		//Here we need to convert template function to template name otherwise it will not function properly. 
		//Loop through each column of the data..
		//replace template function with template string		
		_.forEach(reportDefinition, function (column) {
			if (!_.isUndefined(column.template)) {
				column.template = angular.copy(_.find(reportDefinationList[type].definition, { field: column.field })).template;
			}
		});

		$http({ method: "post", url: dataAPI.base_url + "/report/definition/save", "data": { "reportName": type, "reportDefinition": { "definition": reportDefinition } } }).then(function (response) {
			deffer.resolve(response.data.data);
		}, function (error) {
			deffer.reject(error);
		});
		deffer.promise;
	};

	return reportsService;
}]);