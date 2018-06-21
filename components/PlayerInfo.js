var PlayerInfo = React.createClass({
	getInitialState: function() {
		return {
			HealthValue:100,
			PhysicalValue:100
		};
	},

	getPlayerInfo: function (){
		$.getJSON("http://localhost:8000/player_info", this.getPlayerInfoCallback);
	},

	getPlayerInfoCallback: function (result) {
		var temp = jQuery.parseJSON(result);
		this.setState({
			HealthValue:temp.health_value,
			PhysicalValue:temp.physical_value
		});
	},

	render: function() {
		var szHealthValue = this.state.HealthValue + '%'
		var szPhysicalValue = this.state.PhysicalValue + '%'
		return (
				<div>
                <div className="progress progress-striped active">
                    <div className="progress-bar" style={{width : szHealthValue}}>
                        <span>Health: {szHealthValue}</span>
                    </div>
                </div>
                <div className="progress progress-striped active">
                    <div className="progress-bar" style={{width : szPhysicalValue}}>
                        <span>Physical: {szPhysicalValue}</span>
                    </div>
                </div>
				</div>
		);
	},

	componentDidMount () {
		this.getPlayerInfo()
	},

	componentWillUnmount () {
	},
});

