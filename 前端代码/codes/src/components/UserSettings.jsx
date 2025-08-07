import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';

const securityQuestions = [
  "你拥有的第一个电子设备（如手机、游戏机）品牌是什么？",
  "你第一次参加工作时的职位全称是什么？",
  "你第一次旅行去的城市是哪里？",
  "你最喜欢的颜色是？",
  "你的第一个宠物叫什么？",
  "你第一次学会做的一道菜是什么？",
  "您最喜欢的歌手是？",
  "您最喜欢的城市是？"
];

const UserSettings = ({ user, onLogout }) => {
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 从localStorage获取用户密保问题
  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const currentUser = registeredUsers[user?.username];
    if (currentUser?.securityQuestion) {
      setSecurityQuestion(currentUser.securityQuestion);
      setSecurityAnswer(currentUser.securityAnswer || '');
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 验证密码
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('请填写所有密码字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }

    if (newPassword.length < 6) {
      setError('新密码长度至少为6位');
      return;
    }

    // 验证当前密码
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const currentUser = registeredUsers[user?.username];
    
    if (currentUser && currentUser.password !== currentPassword) {
      setError('当前密码不正确');
      return;
    }

    // 更新密码
    if (currentUser) {
      currentUser.password = newPassword;
      registeredUsers[user.username] = currentUser;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // 如果是当前登录用户，更新localStorage中的用户信息
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (loggedInUser.username === user.username) {
        loggedInUser.password = newPassword;
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }
      
      setSuccess('密码修改成功');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('密码修改成功');
    }
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!securityQuestion || !securityAnswer) {
      setError('请填写密保问题和答案');
      return;
    }

    // 更新密保信息
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const currentUser = registeredUsers[user?.username];
    
    if (currentUser) {
      currentUser.securityQuestion = securityQuestion;
      currentUser.securityAnswer = securityAnswer;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      setSuccess('密保信息更新成功');
      toast.success('密保信息更新成功');
    }
  };

  const handleThemeChange = (isDark) => {
    setTheme(isDark ? 'dark' : 'light');
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">修改密码</CardTitle>
        </CardHeader>
        <CardContent>
          {(error || success) && (
            <Alert variant={error ? "destructive" : "default"} className="mb-3">
              <AlertDescription>
                {error || success}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm">当前密码</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-8"
              />
            </div>
            
            <Button type="submit" size="sm">更新密码</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">密保设置</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecurityUpdate} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="securityQuestion" className="text-sm">密保问题</Label>
              <Select value={securityQuestion} onValueChange={setSecurityQuestion}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="请选择密保问题" />
                </SelectTrigger>
                <SelectContent>
                  {securityQuestions.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="securityAnswer" className="text-sm">密保答案</Label>
              <Input
                id="securityAnswer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="请输入密保答案"
                className="h-8"
              />
            </div>
            
            <Button type="submit" size="sm">更新密保</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">显示设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">深色模式</h3>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={handleThemeChange}
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">账户操作</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={onLogout}
            size="sm"
            className="w-full"
          >
            退出登录
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;