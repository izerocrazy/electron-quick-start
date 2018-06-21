var AllEventType = React.createClass({
	getInitialState: function() {
		return {eventTypeJson: ""};
	},

	getAllEventType: function(event) {
		$.getJSON("http://localhost:8000/all_event_type", this.allEventTypeCallback);
	},

	allEventTypeCallback: function(result) {
		this.setState({eventTypeJson:result});
	},

	onClickEvent: function (event) {
		$.getJSON("http://localhost:8000/begin_event?TypeId="+event.target.value, this.beginEventCallback);
	},

	beginEventCallback: function (result) {
		// 通知其他组件
		PubSub.publish('onNewEvent')
	},

	renderSingleEvent:function (event_data) {
		return (
			<li><a value={event_data.type_id} onClick={this.onClickEvent}>{event_data.type_name}</a></li>
		);
	},

	render: function() {
		if (this.state.eventTypeJson== "")
		{
			return (
				<p>Event List Is None</p>
			);
		}
		else
		{
			var temp = jQuery.parseJSON(this.state.eventTypeJson);
			var showList = temp.event_list.map(this.renderSingleEvent);

			return (
				<ul className="nav navbar-nav">
				{showList}
				</ul>
			);
		}
	},

	componentDidMount () {
		this.getAllEventType()
	}
});

