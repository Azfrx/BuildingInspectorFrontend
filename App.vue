<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	
	/* 覆盖myFilePicker组件中的删除按钮样式 */
	.icon-del-box {
		position: absolute !important;
		top: 3px !important;
		right: 3px !important;
		height: 26px !important;
		width: 26px !important;
		border-radius: 50% !important;
		background-color: rgba(0, 0, 0, 0.5) !important;
		z-index: 999 !important;
		transform: rotate(-45deg) !important;
		bottom: auto !important;
	}
  .icon-del {
    width: 15px !important;
    height: 2px !important;
    background-color: #fff !important;
    border-radius: 2px !important;
  }
</style>
