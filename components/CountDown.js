var CountDown = React.createClass({
	getInitialState: function() {
		// 默认 20 分钟
		return {TimeLeft:5 * 1000};
	},

	setLeftTime: function (newTime) {
		this.setState({ 
			newTime
		})
	},

	countTime:function (){
		this.TimeoutId && clearTimeout(this.TimeoutId);

		if (this.state.TimeLeft <= 0) {//这里就是时间到了之后应该执行的动作了，这里只是弹了一个警告框
			layer.alert("时间到！");
			this.state.TimeLeft = 0;
			return;
		}

		this.state.TimeLeft = this.state.TimeLeft - 1000;
		this.setState ({
			TimeLeft:this.state.TimeLeft
		})

		var func = this.countTime;
		this.TimeoutId = setTimeout(()=>{
			func();
		}, 1000);
	},

	getNowEvent: function (eventName, event) {
		console.log(event)
		layer.alert("现在事件:" + event.title)
	},

	render: function() {
		var startMinutes = parseInt(this.state.TimeLeft / (60 * 1000), 10);
		var startSec = parseInt((this.state.TimeLeft - startMinutes * 60 * 1000) / 1000);
		return (
			<p>{startMinutes}:{startSec}</p>
		);
	},

	componentDidMount () {
		var func = this.countTime;
		this.TimeoutId = setTimeout(()=>{
			func();
		}, 1000);

		PubSub.subscribe('onNowEvent', this.getNowEvent)
	},

	componentWillUnmount () {
		this.TimeoutId && clearTimeout(this.TimeoutId);

		PubSub.unsubscribe('onNowEvent')
	},
});

