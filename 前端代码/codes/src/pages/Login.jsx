import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendEmailVerificationCode, verifyEmailCode } from '@/services/email';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: 输入用户名, 2: 验证方式, 3: 密保验证, 4: 邮箱验证, 5: 重置密码
  const [forgotUsername, setForgotUsername] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // 用于存储用户注册时的邮箱
  const [emailCountdown, setEmailCountdown] = useState(0); // 邮箱验证码倒计时
  const navigate = useNavigate();

  // 生成4位数字验证码
  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCountdown(60);
  };

  // 初始化验证码
  useEffect(() => {
    generateCaptcha();
  }, []);

  // 倒计时
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      generateCaptcha();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 邮箱验证码倒计时
  useEffect(() => {
    let timer;
    if (emailCountdown > 0) {
      timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [emailCountdown]);

  // 模拟用户角色数据
  const mockUsers = {
    'sales': { password: 'sales123', role: '销售代表', name: '销售小孙' },
    'manager': { password: 'manager123', role: '销售经理', name: '销售组长凝凝子' },
    'warehouse': { password: 'warehouse123', role: '仓库管理员', name: '炼乳会' },
    'finance': { password: 'finance123', role: '财务人员', name: '缰绳喜' },
    'admin': { password: 'admin123', role: '系统管理员', name: 'codekiller神' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 验证验证码
    if (captcha !== captchaCode) {
      setError('验证码错误，请重新输入');
      generateCaptcha();
      setLoading(false);
      return;
    }

    // 检查是否是注册用户
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const isRegisteredUser = registeredUsers[username];

    // 模拟登录验证
    setTimeout(() => {
      // 先检查是否为注册用户
      if (isRegisteredUser) {
        // 验证密码
        if (isRegisteredUser.password !== password) {
          setError('用户名或密码错误');
          generateCaptcha();
          setLoading(false);
          return;
        }

        // 登录成功
        const loginData = {
          username,
          name: isRegisteredUser.name,
          role: isRegisteredUser.role,
          loginTime: new Date().toISOString(),
          ip: '192.168.1.100' // 模拟IP
        };

        // 存储登录信息
        localStorage.setItem('user', JSON.stringify(loginData));
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        }

        // 记录登录日志
        console.log('登录日志:', loginData);

        // 根据角色跳转
        navigate('/');
        setLoading(false);
        return;
      }

      // 检查是否为默认用户
      const user = mockUsers[username];
      if (!user || user.password !== password) {
        setError('用户名或密码错误');
        generateCaptcha();
        setLoading(false);
        return;
      }

      // 登录成功
      const loginData = {
        username,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString(),
        ip: '192.168.1.100' // 模拟IP
      };

      // 存储登录信息
      localStorage.setItem('user', JSON.stringify(loginData));
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      }

      // 记录登录日志
      console.log('登录日志:', loginData);

      // 根据角色跳转
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  // 忘记密码 - 下一步
  const handleForgotNext = async () => {
    if (forgotStep === 1) {
      // 验证用户名是否存在
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const isRegisteredUser = registeredUsers[forgotUsername];
      
      if (!isRegisteredUser) {
        toast.error('用户不存在');
        return;
      }
      
      // 保存用户邮箱用于后续显示
      setUserEmail(isRegisteredUser.email || `${forgotUsername}@example.com`);
      setForgotStep(2);
      return;
    }
    
    if (forgotStep === 2) {
      if (!verificationMethod) {
        toast.error('请选择验证方式');
        return;
      }
      
      // 如果选择密保问题，获取用户密保问题
      if (verificationMethod === 'security') {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        const user = registeredUsers[forgotUsername];
        
        if (user && user.securityQuestion) {
          setSecurityQuestion(user.securityQuestion);
          setForgotStep(3);
        } else {
          toast.error('该用户未设置密保问题，请选择其他验证方式');
        }
        return;
      }
      
      // 如果选择邮箱验证
      if (verificationMethod === 'email') {
        setForgotStep(4);
        // 模拟发送验证码
        await sendEmailCode();
        return;
      }
    }
    
    if (forgotStep === 3) {
      // 验证密保答案
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      const user = registeredUsers[forgotUsername];
      
      if (user && user.securityAnswer === securityAnswer) {
        setForgotStep(5);
      } else {
        toast.error('密保答案错误');
      }
      return;
    }
    
    if (forgotStep === 4) {
      // 验证邮箱验证码
      try {
        const result = await verifyEmailCode({
          email: userEmail,
          code: emailCode,
          username: forgotUsername
        });
        
        if (result.success) {
          setForgotStep(5);
          toast.success('邮箱验证成功');
        } else {
          toast.error(result.message || '验证码错误');
        }
      } catch (error) {
        toast.error(error.message || '验证失败');
      }
      return;
    }
    
    if (forgotStep === 5) {
      // 重置密码
      if (!newPassword || !confirmNewPassword) {
        toast.error('请输入新密码');
        return;
      }
      
      if (newPassword !== confirmNewPassword) {
        toast.error('两次输入的密码不一致');
        return;
      }
      
      if (newPassword.length < 6) {
        toast.error('密码长度至少为6位');
        return;
      }
      
      // 更新密码
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registeredUsers[forgotUsername]) {
        registeredUsers[forgotUsername].password = newPassword;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        toast.success('密码重置成功');
        setForgotPasswordOpen(false);
        resetForgotForm();
      }
      return;
    }
  };

  // 发送邮箱验证码
  const sendEmailCode = async () => {
    try {
      const result = await sendEmailVerificationCode({
        email: userEmail,
        username: forgotUsername
      });
      
      if (result.success) {
        setEmailSent(true);
        setEmailCountdown(60); // 设置60秒倒计时
        toast.success(result.message || '验证码已发送至您的邮箱');
      } else {
        toast.error(result.message || '发送验证码失败');
      }
    } catch (error) {
      toast.error(error.message || '发送验证码失败');
    }
  };

  // 忘记密码 - 上一步
  const handleForgotBack = () => {
    if (forgotStep > 1) {
      setForgotStep(forgotStep - 1);
    } else {
      setForgotPasswordOpen(false);
      resetForgotForm();
    }
  };

  // 重置忘记密码表单
  const resetForgotForm = () => {
    setForgotStep(1);
    setForgotUsername('');
    setVerificationMethod('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setEmailCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setEmailSent(false);
    setUserEmail('');
    setEmailCountdown(0);
  };

  // 粒子背景组件
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SD</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SD销售分发系统</h1>
          <p className="text-gray-600">企业级销售管理平台</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-800">用户登录</CardTitle>
            <CardDescription>请输入您的登录凭据</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">用户名</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  提示：销售代表(sales)、销售经理(manager)、仓库管理员(warehouse)、财务人员(finance)、系统管理员(admin)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">验证码</label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="请输入验证码"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    maxLength={4}
                    className="flex-1"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <div className="px-4 py-2 bg-gray-100 rounded-md font-mono text-lg tracking-widest">
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      disabled={countdown > 0}
                    >
                      <RefreshCw className={`h-4 w-4 ${countdown > 0 ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                {countdown > 0 && (
                  <p className="text-xs text-gray-500">{countdown}秒后自动刷新</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    记住账号
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  忘记密码？
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  立即注册
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2024 SD销售分发系统. 保留所有权利.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 忘记密码对话框 */}
      <Dialog open={forgotPasswordOpen} onOpenChange={(open) => {
        if (!open) {
          resetForgotForm();
        }
        setForgotPasswordOpen(open);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {forgotStep === 1 && '忘记密码'}
              {forgotStep === 2 && '选择验证方式'}
              {forgotStep === 3 && '密保验证'}
              {forgotStep === 4 && '邮箱验证'}
              {forgotStep === 5 && '重置密码'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {forgotStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">用户名</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="请输入用户名"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleForgotNext} className="bg-blue-600 hover:bg-blue-700">
                    下一步
                  </Button>
                </div>
              </div>
            )}
            
            {forgotStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">验证方式</Label>
                  <Select value={verificationMethod} onValueChange={setVerificationMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择验证方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security">密保问题</SelectItem>
                      <SelectItem value="email">邮箱验证码</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleForgotBack}>
                    上一步
                  </Button>
                  <Button onClick={handleForgotNext} className="bg-blue-600 hover:bg-blue-700">
                    下一步
                  </Button>
                </div>
              </div>
            )}
            
            {forgotStep === 3 && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700">问题: {securityQuestion}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">答案</Label>
                  <Input
                    type="text"
                    placeholder="请输入密保答案"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleForgotBack}>
                    上一步
                  </Button>
                  <Button onClick={handleForgotNext} className="bg-blue-600 hover:bg-blue-700">
                    验证
                  </Button>
                </div>
              </div>
            )}
            
            {forgotStep === 4 && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    验证码已发送至您的邮箱: 
                    <span className="font-medium"> {userEmail || `${forgotUsername}@example.com`}</span>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">验证码</Label>
                  <Input
                    type="text"
                    placeholder="请输入6位验证码"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={sendEmailCode}
                  disabled={emailCountdown > 0}
                  className="w-full"
                >
                  {emailCountdown > 0 ? `再次发送 (${emailCountdown}s)` : '再次发送验证码'}
                </Button>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleForgotBack}>
                    上一步
                  </Button>
                  <Button onClick={handleForgotNext} className="bg-blue-600 hover:bg-blue-700">
                    验证
                  </Button>
                </div>
              </div>
            )}
            
            {forgotStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">新密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="请输入新密码"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">密码长度至少6位</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">确认新密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="请再次输入新密码"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleForgotBack}>
                    上一步
                  </Button>
                  <Button onClick={handleForgotNext} className="bg-blue-600 hover:bg-blue-700">
                    重置密码
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;