import { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  InputNumber, 
  Select, 
  Button, 
  Typography, 
  Form,
  message,
} from 'antd'
import { SwapOutlined, SettingOutlined } from '@ant-design/icons'
import { PRICE_DATA, formatNumber, formatUSD, getBalance } from './tokens'

const { Title, Text } = Typography

function App() {
  const [swapFlag, setSwapFlag] = useState(false)
  const [form] = Form.useForm()
  const [fromAmountValue, setFromAmountValue] = useState(null)
  // Create token options
  const tokenOptions = useMemo(() => 
    PRICE_DATA.map(token => {
      const label = (
        <div className="flex items-center gap-2">
          <img 
            src={`/tokens/${token.currency}.svg`}
            alt={token.currency}
            className="w-6 h-6 rounded-full"
            onError={(e) => { 
              e.target.onerror = null
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="w-6 h-6 rounded-full bg-gray-600 items-center justify-center text-xs hidden">
            {token.currency.charAt(0)}
          </div>
          <span>{token.currency}</span>
        </div>
      )
      return {
        value: token.currency,
        label,
        key: token.currency,
      }
    }),
    []
  )
  const [fromToken, setFromToken] = useState(() => tokenOptions.find(opt => opt.value === 'ETH'))
  const [toToken, setToToken] = useState(() => tokenOptions.find(opt => opt.value === 'USDC'))
  const [toAmount, setToAmount] = useState(null)
  const [loading, setLoading] = useState(false)

  // Watch form values
  const fromAmount = Form.useWatch('fromAmount', form)

  // Keep fromAmountValue in sync with form
  useEffect(() => {
    setFromAmountValue(fromAmount)
  }, [fromAmount])

  // Get token price
  const getPrice = (currency) => {
    const val = typeof currency === 'object' && currency !== null ? currency.value : currency
    return PRICE_DATA.find(t => t.currency === val)?.price || 0
  }

  // Calculate exchange rate
  const exchangeRate = useMemo(() => {
    const fromPrice = getPrice(fromToken.value)
    const toPrice = getPrice(toToken.value)
    if (!fromPrice || !toPrice) return 0
    return fromPrice / toPrice
  }, [fromToken.value, toToken.value])

  // Get balances
  const fromBalance = getBalance(fromToken.value)
  const toBalance = getBalance(toToken.value)

  // Update toAmount when fromAmount changes
  useEffect(() => {
        // Log swap after swapFlag triggers and state is updated
        if (swapFlag !== false && typeof swapFlag === 'number' && !isNaN(swapFlag)) {
          console.log('Swap complete:', {
            fromAmount: swapFlag,
            fromToken: fromToken.value,
            toAmount: swapFlag * (getPrice(fromToken.value) / getPrice(toToken.value)),
            toToken: toToken.value
          })
        }
    if (fromAmount && exchangeRate) {
      setToAmount(fromAmount * exchangeRate)
    } else {
      setToAmount(null)
    }
  }, [fromAmount, exchangeRate])  

  // MAX button click handler
  const handleMaxClick = () => {
    form.setFieldsValue({ fromAmount: fromBalance })
    form.validateFields(['fromAmount'])
  }

  // Swap tokens
  const handleSwapTokens = () => {
    // Save current toAmount
    const prevToAmount = toAmount
    console.log('Swapping:', {
      fromAmount: form.getFieldValue('fromAmount'),
      fromToken: fromToken.value,
      toAmount: toAmount,
      toToken: toToken.value
    })
    setFromToken(toToken)
    setToToken(fromToken)
    setSwapFlag(prevToAmount)
  }

  // After swapping directions, set the new fromAmount to the previous toAmount
  useEffect(() => {
    if (swapFlag !== false) {
      if (typeof swapFlag === 'number' && !isNaN(swapFlag)) {
        // Set the form value and state
        form.setFieldsValue({ fromAmount: swapFlag })
        setFromAmountValue(swapFlag)
        // Immediately recalculate toAmount using the new exchange rate and the new fromAmount
        const newExchangeRate = getPrice(fromToken.value) / getPrice(toToken.value)
        const newToAmount = swapFlag * newExchangeRate
        setToAmount(newToAmount)
      } else {
        form.setFieldsValue({ fromAmount: null })
        setFromAmountValue(null)
        setToAmount(null)
      }
      setSwapFlag(false)
    }
  }, [fromToken, toToken])

  // Handle form submit
  const handleSubmit = async (values) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success(`Successfully swapped ${formatNumber(values.fromAmount)} ${fromToken.value} for ${formatNumber(toAmount)} ${toToken.value}`)
    form.resetFields()
    setToAmount(null)
    setLoading(false)
  }

  // USD values
  const fromUSD = fromAmount ? fromAmount * getPrice(fromToken.value) : 0
  const toUSD = toAmount ? toAmount * getPrice(toToken.value) : 0
  const feeUSD = fromUSD * 0.02

  // Custom validation
  const validateFromAmount = (_, value) => {
    if (value === null || value === undefined || value === '') {
      return Promise.reject(new Error('This field is required'))
    }
    if (value <= 0) {
      return Promise.reject(new Error('Amount must be greater than 0'))
    }
    if (value > fromBalance) {
      return Promise.reject(new Error('Insufficient balance'))
    }
    if (fromToken.value === toToken.value) {
      return Promise.reject(new Error('Please select different tokens'))
    }
    return Promise.resolve()
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse"></div>
        
        <Card 
          className="shadow-2xl relative"
          style={{ 
            background: 'rgba(31, 41, 55, 0.95)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}
        >

          <div className="flex justify-between items-center mb-6">
            <Title level={4} className="!mb-0 !text-white">Swap Currency</Title>
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              className="text-gray-400 hover:text-white"
            />
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark={false}
          >
            {/* From Token Section */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-2">
              <div className="flex justify-between mb-2">
                <Text className="text-gray-400 text-sm">You pay</Text>
                <div className="flex items-center gap-2">
                  <Text className="text-gray-400 text-sm">Balance: {formatNumber(fromBalance)}</Text>
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={handleMaxClick}
                    className="text-purple-400 hover:text-purple-300 p-0 h-auto text-sm"
                  >
                    MAX
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Form.Item
                  name="fromAmount"
                  className="flex-1 mb-0"
                  rules={[{ validator: validateFromAmount }]}
                >
                  <div className="relative flex items-center">
                    <InputNumber
                      placeholder="0"
                      controls={false}
                      className="w-full bg-transparent border-none text-2xl pr-8"
                      style={{ 
                        background: 'transparent',
                        fontSize: '24px',
                        fontWeight: 600,
                      }}
                      min={0}
                      value={fromAmountValue}
                      onChange={val => {
                        setFromAmountValue(val)
                        form.setFieldsValue({ fromAmount: val })
                      }}
                    />
                  </div>
                </Form.Item>
                
                <Select
                  value={fromToken}
                  labelInValue
                  onChange={setFromToken}
                  options={tokenOptions}
                  className="w-36"
                  popupClassName="bg-gray-800"
                  dropdownStyle={{ background: '#1f2937' }}
                />
              </div>
              
              <Text className="text-gray-500 text-sm mt-2 block">
                {formatUSD(fromUSD)}
              </Text>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <Button
                type="default"
                shape="circle"
                icon={<SwapOutlined rotate={90} />}
                onClick={handleSwapTokens}
                className="bg-gray-700 border-purple-500/50 hover:bg-gray-600 hover:border-purple-400"
                style={{ 
                  width: 40, 
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>

            {/* To Token Section */}
            <div className="bg-gray-800/50 rounded-xl p-4 mt-2">
              <div className="flex justify-between mb-2">
                <Text className="text-gray-400 text-sm">You receive</Text>
                <Text className="text-gray-400 text-sm">Balance: {formatNumber(toBalance)}</Text>
              </div>
              
              <div className="flex gap-3">
                <InputNumber
                  value={toAmount !== null ? toAmount : null}
                  placeholder="0"
                  controls={false}
                  readOnly
                  className="flex-1 bg-transparent border-none text-2xl"
                  style={{ 
                    background: 'transparent',
                    fontSize: '24px',
                    fontWeight: 600,
                  }}
                  stringMode
                />
                
                <Select
                  value={toToken}
                  labelInValue
                  onChange={setToToken}
                  options={tokenOptions}
                  className="w-36"
                  dropdownStyle={{ background: '#1f2937' }}
                />
              </div>
              
              <Text className="text-gray-500 text-sm mt-2 block">
                {formatUSD(toUSD)}
              </Text>
            </div>

            {/* Exchange Rate Infomation */}
            <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-purple-500/20">
              <div className="flex justify-between text-sm">
                <Text className="text-gray-400">Rate</Text>
                <Text className="text-gray-300">
                  1 {fromToken.value} = {formatNumber(exchangeRate)} {toToken.value}
                </Text>
              </div>
              <div className="flex justify-between text-sm mt-1">
                  <Text className="text-gray-400">Fee (2%)</Text>
                  <Text className="text-gray-300">{formatUSD(feeUSD)}</Text>
                </div>
            </div>

            {/* Submit Button */}
            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                className="h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 border-0 hover:from-purple-500 hover:to-blue-400"
                loading={loading}
              >
                {loading ? 'Swapping...' : 'Swap'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default App
