jQuery ->
  gridOptions =
    datatype: "json"
    restful:  true
    rowNum:20,
    viewrecords: true
    multiselect: false
    height: '450'
    rowList:[20,40,80]
    pager: '#pager'
    sortname: 'id'
    sortorder: "desc"
    caption:"User Management"
    editurl: '/users/post_data.json'
    colNames: ['id','Email', 'Username','First Name', 'Last Name', 'Roles','Edit roles','Action']
    colModel: [
        {
          name:'id'
          index:'users.id'
          width:55
        }
        {
          name:'email'
          index:'users.email'
          width:200
          editable:true
        }
        {
          name:'username'
          index:'users.username'
          width:110
          editable:true
        }
        {
          name:'first_name'
          index:'users.first_name'
          width:100
          editable:true
        }
        {
          name:'last_name'
          index:'users.last_name'
          width:120
          editable:true
        }
        {
          name: "roles.name"
          index:'roles.name'
          width: 120
          search:true
        }
        {
          name: "Edit roles"
          width: 120
          formatter: "link"
          search:false
          sortable: false
        }
        {
          name: 'action'
          index: 'action'
          width: 150
          sortable: false
          formatter:'actions'
          formatoptions:{keys:true}
          search:false
        }
        ]
  $("#user_list").jqGrid gridOptions
  $("#user_list").jqGrid 'navGrid','#pager'
                            edit:false
                            add:true
                            del:false
                            search:false

  $("#user_list").jqGrid 'filterToolbar'
                            stringResult: true
                            searchOnEnter : false
errorTextFormat = (data) ->
    reponse = jQuery.parseJSON data.responseText
    res = "This form has following errors: <br />"
    res += reponse.status

$.extend jQuery.jgrid.edit, errorTextFormat:
                              errorTextFormat