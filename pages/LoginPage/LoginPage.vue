<!-- 登录页面
	author ：ykx
	date : 2025 . 6.3
 -->
<template>
	<view class='loginPage'>
		<view class="logo">
			<view class="logo-container">
				<image src="@/static/image/loginLogo.jpg" mode="widthFix"
					style="width: 100%; background-color: #ffffff;"></image>
			</view>
		</view>
		<view class="form">
			<view class="item_1">
				<view class="name">用户名</view>
				<input class="uni-input" v-model="username" placeholder="请输入用户名" placeholder-style="color: #cccccc" />
			</view>
			<view class="item_2">
				<view class="name">密码</view>
				<view class="container">
					<view class="container_1">
						<input class="uni-input" v-model="password" :type="showPassword ? 'text' : 'password'"
							placeholder="请输入密码" placeholder-style="color: #cccccc" />
						<view class="password-icons">
							<image :src="showPassword ? '/static/image/EyeOutline.png' : '/static/image/open.png'"
								mode="widthFix" style="width:5%" class="password-icon"
								@click="togglePasswordVisibility">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="item_3">
				<radio-group name="radio">
					<label>
						<radio :checked="rememberPassword" @click.stop="toggleRememberPassword" />
						<span @click.stop="toggleRememberPassword">记住密码</span>
					</label>
				</radio-group>
			</view>
			<view class="item_4">
				<button size="default" type="default" style="color:#ffffff;backgroundColor:#0F4687;borderColor:#1AAD19"
					hover-class="is-hover" @click="handleLogin">登录</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		setAllUserInfo,
	} from '../../utils/writeNew';
	import {
		userStore
	} from '@/store/index.js'
	import {
		idStore
	} from '../../store/idStorage';
	import { setRootDir } from '../../utils/write';
	// 引入配置文件
	import apiConfig from '@/config/api.js';
	import checkUpdate from '../../uni_modules/uni-upgrade-center-app/utils/check-update';
	const username = ref('');
	const password = ref('');
	const userInfo = userStore()
	const rememberPassword = ref(true);
	const showPassword = ref(false);
	const loading = ref(false);
	const idInfo = idStore();
	// 添加双击事件处理函数
	const toggleRememberPassword = () => {
		console.log('切换记住密码状态，当前状态:', rememberPassword.value);
		rememberPassword.value = !rememberPassword.value;
		console.log('切换后的状态:', rememberPassword.value);
	};

	// 页面加载时检查是否有保存的用户信息
	onMounted(async () => {
		//记住密码功能
		// try {
		// 	const savedUser = await getUser(1);
		// 	// 只有当savedUser存在且不为空时才执行填充操作
		// 	if (savedUser && Object.keys(savedUser).length > 0) {
		// 		console.log('找到保存的用户信息:', savedUser);
		// 		console.log('savedUser:', savedUser);
		// 		const token = savedUser.token;
		// 		console.log('token:', token);
		// 		// 如果文件存在，勾选记住密码并填充内容
		// 		rememberPassword.value = true;
		// 		username.value = savedUser.username;
		// 		password.value = savedUser.password;
		// 	} else {
		// 		console.log('未找到保存的用户信息');
		// 	}
		// } catch (error) {
		// 	console.error('读取用户信息失败:', error);
		// }
	});

	onMounted(() => {
		checkUpdate();   
		const lastUsername = uni.getStorageSync('lastUsername')
		const lastPassword = uni.getStorageSync('lastPassword')
		const isRemember = uni.getStorageSync('isRemember')

		if (isRemember) {
			username.value = lastUsername
			password.value = lastPassword
		}
	})

	const togglePasswordVisibility = () => {
		showPassword.value = !showPassword.value;
	};

	// 离线登录时设置本地路径
	const setOfflineUserPaths = async (username) => {
		return new Promise((resolve) => {
			console.log('开始检查离线用户的本地路径，用户名:', username);

			plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
				entry.createReader().readEntries((entries) => {
					console.log('检查_doc/目录内容，寻找用户目录:');

					// 查找匹配当前用户的UD目录
					const udDirs = entries
						.filter(e => e.isDirectory && e.name.startsWith('UD'))
						.filter(e => e.name.includes(username))
						.sort((a, b) => b.name.localeCompare(a.name)); // 最新的在前

					// 查找匹配当前用户的UL目录
					const ulDirs = entries
						.filter(e => e.isDirectory && e.name.startsWith('UL'))
						.filter(e => e.name.includes(username))
						.sort((a, b) => b.name.localeCompare(a.name)); // 最新的在前

					let hasData = false;

					if (udDirs.length > 0) {
						const latestUDDir = udDirs[0].name;
						console.log('找到匹配用户的UD目录:', latestUDDir);
						userInfo.setUDPath(latestUDDir);
						hasData = true;
					} else {
						console.log('未找到匹配用户的UD目录');
					}

					if (ulDirs.length > 0) {
						const latestULDir = ulDirs[0].name;
						console.log('找到匹配用户的UL目录:', latestULDir);
						userInfo.setULPath(latestULDir);
						hasData = true;
					} else {
						console.log('未找到匹配用户的UL目录');
					}

					console.log('离线登录路径设置完成，UDPath:', userInfo.UDPath, 'ULPath:', userInfo.ULPath);
					console.log('是否找到数据:', hasData);
					resolve({ hasData });
				}, (err) => {
					console.error('读取_doc/目录失败:', err);
					resolve({ hasData: false }); // 失败时返回无数据
				});
			}, (err) => {
				console.error('解析_doc/目录失败:', err);
				resolve({ hasData: false }); // 失败时返回无数据
			});
		});
	};

	const handleLogin = async () => {
		if (!username.value || !password.value) {
			uni.showToast({
				title: '请输入用户名和密码',
				icon: 'none'
			});
			return;
		}

		loading.value = true;

		// 登录前先清理之前的用户数据
		userInfo.clearUserData();

		try {
			// 在线登录逻辑
			const response = await apiConfig.login(username.value,password.value)
			// const response = await uni.request({
			// 	url: `${apiConfig.baseURL}${apiConfig.endpoints.login}?username=${username.value}&password=${password.value}`,
			// 	method: 'POST'
			// });

			console.log('登录响应:', response.data);

			if (response.data.code === 0) {
				userInfo.setUserInfo({
					username: username.value,
					password: password.value,
					infoData: response.data,
				})
				idInfo.setUserId({value:response.data.userId})

				// 调用setRootDir方法创建根目录
				try {
					console.log('开始调用setRootDir创建根目录');
					const rootDir = await setRootDir();
					console.log('根目录创建成功');

					// 检查返回的目录对象
					if (rootDir && rootDir.fullPath) {
						console.log('创建的目录路径:', rootDir.fullPath);
						console.log('创建的目录名称:', rootDir.name);
					} else {
						console.warn('根目录创建成功但返回对象不完整');
					}
				} catch (error) {
					console.error('创建根目录失败，错误详情:', error);
					// 尝试显示更详细的错误信息
					if (error.message) {
						console.error('错误信息:', error.message);
					}
					if (error.stack) {
						console.error('错误堆栈:', error.stack);
					}
				}

				// 在线登录成功后也设置本地路径
				try {
					console.log('在线登录：开始检查和设置本地路径');
					const pathResult = await setOfflineUserPaths(username.value);
					console.log('在线登录：路径设置结果:', pathResult);
				} catch (error) {
					console.error('在线登录：设置本地路径失败:', error);
					// 设置路径失败不影响登录流程，继续执行
				}

				console.log('登录成功，准备跳转');
				uni.navigateTo({
					url: '/pages/home/home'
				});
				//在线登录后保存用户信息到本地
				console.log('准备保存用户信息');
				let accountArray = uni.getStorageSync('accountArray') || null
				if (!Array.isArray(accountArray)) {
					accountArray = [{
						username: username.value,
						password: password.value,
						infoData: response.data,
					}]
				} else {
					accountArray.push({
						username: username.value,
						password: password.value,
						infoData: response.data,
					})
				}
				//去重 保留后者
				const uniqueAccounts = Array.from(
					new Map(accountArray.map(item => [item.username, item])).values()
				);
				uni.removeStorageSync('accountArray')
				uni.setStorageSync('accountArray', uniqueAccounts)
				//上次保存密码登录的账号密码
				uni.removeStorageSync('lastUsername')
				uni.removeStorageSync('lastPassword')
				uni.setStorageSync('lastUsername', username.value)
				uni.setStorageSync('lastPassword', password.value)

				console.log('记住密码状态:', rememberPassword.value);
				if (rememberPassword.value) {
					uni.removeStorageSync('isRemember')
					uni.setStorageSync('isRemember', true)
				} else {
					console.log('未勾选记住密码，下次不填充，但是本地缓存的账号密码不删除');
					uni.removeStorageSync('isRemember')
					uni.setStorageSync('isRemember', false)
				}
			} else {
				uni.showToast({
					title: response.data.msg || '登录失败',
					icon: 'none'
				});
			}
		} catch (error) {
			console.error('离线登录');
			const accountArray = uni.getStorageSync('accountArray')
			// 离线登录逻辑
			let findAccount = false;
			let currentAccountInfo = null;
			for (let i = 0; i < accountArray.length; i++) {
				if (accountArray[i].username === username.value && accountArray[i].password === password.value) {
					findAccount = true
					console.log("zhaodao", accountArray[i]);
					currentAccountInfo = accountArray[i].infoData
					break;
				}
			}
			if (findAccount) {
				console.log('离线登录成功，准备跳转');
				userInfo.setUserInfo({
					username: username.value,
					password: password.value,
					infoData: currentAccountInfo,
				})

				// 离线登录时也需要设置本地路径
				try {
					console.log('离线登录：开始检查和设置本地路径');
					const pathResult = await setOfflineUserPaths(username.value);

					if (!pathResult.hasData) {
						// 没有找到数据包，提示用户需要联网下载
						uni.showModal({
							title: '本地无数据',
							content: '检测到本地没有数据包，请先联网登录下载数据包后再使用离线模式。',
							showCancel: false,
							confirmText: '确定',
							success: () => {
								// 清理用户数据，返回登录页面
								userInfo.clearUserData();
								console.log('用户确认后返回登录页面');
							}
						});
						return; // 不继续登录流程
					}
				} catch (error) {
					console.error('离线登录：设置本地路径失败:', error);
					// 设置路径失败，也提示用户需要联网
					uni.showModal({
						title: '数据检查失败',
						content: '无法检查本地数据，请先联网登录下载数据包。',
						showCancel: false,
						confirmText: '确定',
						success: () => {
							userInfo.clearUserData();
						}
					});
					return;
				}

				// 登录成功，跳转到bridge页面
				uni.navigateTo({
					url: '/pages/home/home'
				});
			} else {
				console.log('离线登录失败：用户名或密码不匹配');
				uni.showToast({
					title: '用户名或密码错误',
					icon: 'none'
				});
			}
			// uni.showToast({
			// 	title: '登录失败，请稍后重试',
			// 	icon: 'none'
			// });
		} finally {
			loading.value = false;
		}
	};
</script>

<style lang="scss" scoped>
	.loginPage {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;

		.logo {
			height: 508px;
			background-color: #ffffff;

			.logo-container {
				background-color: #ffffff;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				position: relative;
				padding-top: 0;

				image {
					background: #ffffff !important;
					display: block;
					position: relative;
					z-index: 1;
				}
			}
		}

		.form {
			display: flex;
			flex-direction: column;
			align-items: center;

			.item_1,
			.item_2 {
				width: 400rpx;
				height: auto;
				margin-bottom: 20rpx;

				.name {
					font-size: 20px;
					color: #666666;
					margin-bottom: 5px;
				}

				.uni-input {
					font-size: 22px;
					color: var(--font-color);
					width: 100%;
					border-bottom: 1px solid #333333;
					padding-bottom: 10rpx;
				}
			}

			.item_2 {
				margin-bottom: 0;
			}

			.item_3 {
				width: 400rpx;
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;

				radio-group {
					width: 100%;
					display: flex;
					justify-content: space-between;

					label {
						display: flex;
						align-items: flex-end;
						height: 22px;
						font-size: 23px;
						color: #333333;
						line-height: 22px;

						radio {
							position: relative;
							top: 0;
							margin-right: 5rpx;
						}
					}
				}
			}

			.item_4 {
				width: 400rpx;
				margin-top: 40rpx;

				button {
					width: 100%;
					height: 60px;
					line-height: 60px;
					font-size: 22px;
				}
			}
		}
	}

	.container_1 {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.password-icons {
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.password-icon {
		cursor: pointer;
		width: 22px !important;
		height: 22px;
		padding: 0;
		margin-bottom: 2px;
	}
</style>