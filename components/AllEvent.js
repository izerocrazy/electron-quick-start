'use strict'

var AllEvent = {}

AllEvent = React.createClass({
	getInitialState: function() {
		return {
			eventJson: "",
			eventsList: null,
		};
	},

	getAllEvent: function(event) {
		$.getJSON("http://localhost:8000/all_event", this.allEventCallback);
	},

	changeOneEventTime: function(event, delta, revertFunc) {
		layer.confirm("Start is [["+event.start.format()+"]], End is [["+event.end.format()+"]], is this okay?", function(index) {
			var szStartTime = event.start.format('YYYY-MM-DD HH:mm:ss')
			var szEndTime = event.end.format('YYYY-MM-DD HH:mm:ss')

			$.getJSON("http://localhost:8000/update_step_time?StepId="+event.id+"&StartTime="+szStartTime+"&EndTime="+szEndTime, function (result){
				layer.msg("Success")
			});

			layer.close(index);
		})
	},

	changeOneEventTime2: function (event) {
		var szStartTime = event.start.format('YYYY-MM-DD HH:mm:ss')
		if (event.end == null) {
			event.end = event.start
		}
		var szEndTime = event.end.format('YYYY-MM-DD HH:mm:ss')
		var changeTimeCallback = this.getAllEvent
		layer.prompt ({formType:0, value:szStartTime,},function (value, index, elem){
			szStartTime = value
			layer.close(index)

			layer.prompt ({formType:0, value:szEndTime,},function (value, index, elem){
				szEndTime = value
				layer.close(index)
				$.getJSON("http://localhost:8000/update_step_time?StepId="+event.id+"&StartTime="+szStartTime+"&EndTime="+szEndTime, changeTimeCallback)
			});
		});
	},

	removeOneEvent: function (calEvent, jsEvent, view) {
		layer.confirm("Want Delete it"+", is this okay?", function(index) {
			$.getJSON("http://localhost:8000/delete_step?StepId="+calEvent.id, this.getAllEvent)
			layer.close(index)
		});
	},

	initCalender: function() {
		// 初始化
		$('#calendar').fullCalendar({
			// put your options and callbacks here
			defaultView: 'agendaDay',
			header:{
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaDay'
			},
			slotDuration: '00:05',
			nowIndicator: true,

			navLinks: true, // can click day/week names to navigate views

			events: null,
			eventLimit: true, // allow "more" link when too many events
			eventClick: this.changeOneEventTime2,

			editable: true,
			eventResize: this.changeOneEventTime,
			eventDrop: this.changeOneEventTime,

			selectable: true,
			selectHelper: true,
			select: function(start, end) {
				// 新加
				var title = prompt('Event Title:');
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
					$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
				}
				$('#calendar').fullCalendar('unselect');
			},

			viewDisplay : function (view) {
				console.log(view)
			},
		})
	},

	clearCalender: function () {
		$('#calendar').fullCalendar('removeEventSource', this.state.eventsList);
	},

	allEventCallback: function(result) {
		layer.msg("refresh success")
		var temp = jQuery.parseJSON(result);
		var eventsList = temp.map(this.createEventForFullcal);

		// 初始化日历
		if (this.state.eventJson == "") {
			this.initCalender()
		}
		else {
			this.clearCalender()
		}

		// 初始化当前事件
		// PubSub.publish('onNowEvent', eventsList[0])

		this.setState({
			eventsList:eventsList,
			eventJson:result
		});
	},

	createEventForFullcal: function (event_data) {
		var newEvent = {};

		newEvent.title = event_data.event_type_name;
		newEvent.start = event_data.start_time;
		newEvent.end = event_data.end_time;
		newEvent.id = event_data.step_id;

		return newEvent;
	},

	renderSingleEvent:function (event_data) {
		return (
			<tr>
			<td>『{event_data.event_type_name}』</td>
			<td>{event_data.last_time} </td> 
			</tr>
		);
	},

	render: function() {
		$('#calendar').fullCalendar('addEventSource', this.state.eventsList);
		$('#calendar').fullCalendar('refetchEvents');

		if (this.state.eventJson== "")
		{
			return (
				<p>Event List Is None</p>
			);
		}
		else
		{
			return (
				<p></p>
			);
		}
	},

	componentDidMount () {
		this.getAllEvent()
		PubSub.subscribe('onNewEvent', this.getAllEvent)
	},

	componentWillUnmount(){
		PubSub.unsubscribe('onNewEvent')
	},
});

module.exports = AllEvent;

