import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

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

  // 模拟用户角色数据
  const mockUsers = {
    'sales1': { 
      password: 'sales123', 
      role: '销售代表', 
      name: '销售小孙',
      phone: '13811112222',
      email: 'xiaosun@example.com'
    },
    'sales2': { 
      password: 'sales234', 
      role: '销售代表', 
      name: '销售小何',
      phone: '13822223333',
      email: 'xiaohe@example.com'
    },
    'manager': { 
      password: 'manager123', 
      role: '销售经理', 
      name: '销售组长凝凝子',
      phone: '13911112222',
      email: 'ningningzi@example.com'
    },
    'warehouse': { 
      password: 'warehouse123', 
      role: '仓库管理员', 
      name: '炼乳会',
      phone: '13922223333',
      email: 'lianruhui@example.com'
    },
    'finance': { 
      password: 'finance123', 
      role: '财务人员', 
      name: '缰绳喜',
      phone: '13933334444',
      email: 'jiangshangxi@example.com'
    },
    'admin': { 
      password: 'admin123', 
      role: '系统管理员', 
      name: 'codekiller神',
      phone: '13944445555',
      email: 'codekiller@example.com'
    }
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

    // 模拟登录验证
    setTimeout(() => {
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
        phone: user.phone,
        email: user.email,
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
    }, 1000);
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
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  忘记密码？
                </a>
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

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2025 SD销售分发系统. 保留所有权利. Produced by Group2
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;