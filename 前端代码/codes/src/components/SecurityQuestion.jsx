import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export const SecurityQuestion = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: 设置密保, 2: 确认密保
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [confirmAnswer, setConfirmAnswer] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!selectedQuestion) {
      setError('请选择密保问题');
      return;
    }
    
    if (!answer.trim()) {
      setError('请输入密保答案');
      return;
    }
    
    setError('');
    setStep(2);
  };

  const handleConfirm = () => {
    if (answer !== confirmAnswer) {
      setError('两次输入的答案不一致');
      return;
    }
    
    // 保存密保问题到localStorage
    const securityData = {
      question: selectedQuestion,
      answer: answer.trim()
    };
    
    // 获取当前注册的用户信息
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const currentUser = Object.keys(registeredUsers).pop(); // 获取最后一个注册的用户
    
    if (currentUser) {
      registeredUsers[currentUser].securityQuestion = securityData.question;
      registeredUsers[currentUser].securityAnswer = securityData.answer;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    
    onSuccess();
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-800">
            {step === 1 ? '设置密保问题' : '确认密保答案'}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? '请选择一个问题并设置答案，用于找回密码' 
              : '请再次输入您的密保答案'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">密保问题 *</Label>
                <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                  <SelectTrigger>
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
                <Label className="text-sm font-medium text-gray-700">密保答案 *</Label>
                <Input
                  type="text"
                  placeholder="请输入密保答案"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>
                  返回
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  下一步
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">问题: {selectedQuestion}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">确认答案 *</Label>
                <Input
                  type="text"
                  placeholder="请再次输入密保答案"
                  value={confirmAnswer}
                  onChange={(e) => setConfirmAnswer(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  上一步
                </Button>
                <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
                  完成设置
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};