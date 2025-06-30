import React, { useState, useEffect } from 'react'
import { ExternalLink, Clock, Bookmark, Share2, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import styled from '@emotion/styled'

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  tag: string;
}

interface Notification {
  event: string;
  message: string;
  article: {
    title: string;
    id: number;
    content: string;
    tag: string;
    url: string;
  };
}

const API_BASE_URL = 'http://172.30.1.59:8000';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: #1a1a1a;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const LogoIcon = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-left: 1rem;
  color: white;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

const Features = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  margin: 2rem 0;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background-color: #4ade80;
      border-radius: 50%;
    }
  }
`;

const SubscribeButton = styled.button`
  background-color: white;
  color: #3b82f6;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const ArticleFeed = styled.div`
  margin-bottom: 3rem;
`;

const ArticleCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  margin-bottom: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ArticleContent = styled.div`
  padding: 1.5rem;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TimeText = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
`;

const ArticleTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const ArticleSummary = styled.p<{ expanded: boolean }>`
  color: #4b5563;
  margin-bottom: ${props => props.expanded ? '1.5rem' : '1rem'};
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.expanded ? 'none' : '1'};
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  font-size: 1rem;
  
  &:hover {
    color: #111827;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${props => props.expanded ? '0' : '2rem'};
    background: ${props => props.expanded ? 'none' : 'linear-gradient(to bottom, transparent, white)'};
    pointer-events: none;
  }
`;

const ExpandButton = styled.button<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #4b5563;
  font-size: 0.875rem;
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: ${props => props.expanded ? '#f8fafc' : '#f1f5f9'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.expanded ? '#e2e8f0' : 'transparent'};

  &:hover {
    color: #1f2937;
    background-color: ${props => props.expanded ? '#f1f5f9' : '#e2e8f0'};
    border-color: ${props => props.expanded ? '#cbd5e1' : 'transparent'};
  }

  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.expanded ? 'rotate(-180deg)' : 'rotate(0deg)'};
  }
`;

const ExpandButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  span {
    position: relative;
    top: 1px;
  }
`;

const ArticleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const SourceText = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  color: #6b7280;
  &:hover {
    color: #1a1a1a;
  }
`;

const ViewLink = styled.a`
  color: #3b82f6;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  background-color: #eff6ff;
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
    background-color: #dbeafe;
  }

  svg {
    margin-left: 0.375rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 100;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ScrollIndicator = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  border-top: 1px solid #e5e7eb;
`;

const QuestionModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const QuestionInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  max-height: 200px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin: 1rem 0;
  box-sizing:border-box;
  font-size: 1rem;
  resize: none;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SubmitButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  z-index: 1;

  &:hover {
    color: #1f2937;
  }
`;

const AnswerText = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  white-space: pre-wrap;
`;

const AskButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  background-color: #eff6ff;
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
    background-color: #dbeafe;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: #eff6ff;
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const App = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())
  const [scrollPosition, setScrollPosition] = useState(0)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchArticles = async (pageNumber: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = new URL(`${API_BASE_URL}/articles`)
      url.searchParams.append('index', (pageNumber).toString())
      
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (pageNumber === 0) {
        setArticles(data)
      } else {
        setArticles(prev => [...prev, ...data])
      }
      setPage(pageNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleArticle = (articleId: string) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
      }
      return newSet
    })
  }

  const handleAskQuestion = async () => {
    if (!selectedArticle || !question.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${selectedArticle.id}/ask?question=${encodeURIComponent(question)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('질문에 대한 답변을 받아오는데 실패했습니다.')
      }

      const data = await response.json()
      setAnswer(data.answer || '답변을 찾을 수 없습니다.')
    } catch (error) {
      console.error('Error asking question:', error)
      setAnswer('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedArticle(null)
    setQuestion('')
    setAnswer('')
  }

  useEffect(() => {
    fetchArticles(0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      if (
        window.innerHeight + position >= 
        document.documentElement.scrollHeight - 100 && 
        !loading
      ) {
        fetchArticles(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page]);

  useEffect(() => {
    // SSE 연결 설정
    const eventSource = new EventSource(`${API_BASE_URL}/news-notifications`);

    eventSource.onmessage = (event) => {
      const data: Notification = JSON.parse(event.data);
      console.log('새로운 뉴스 알림:', data);
      
      if (data.event === 'new_article') {
        setNotifications(prev => [data, ...prev]);
        // 새로운 기사가 오면 기사 목록의 첫 페이지를 새로고침
        fetchArticles(0);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <LogoContainer>
            <Title>Deep-Report</Title>
          </LogoContainer>
          <Subtitle>
            인공지능 분야의 최신 소식과 트렌드를 한눈에 확인하세요
          </Subtitle>
          <Features>
            <span>실시간 업데이트</span>
            <span>매일 10+ 새로운 소식</span>
            <span>신뢰할 수 있는 소스</span>
          </Features>
        </Header>

        <ArticleFeed>
          {articles.map((article) => {
            const isExpanded = expandedArticles.has(article.id)
            return (
              <ArticleCard key={article.id}>
                <ArticleContent>
                  <ArticleMeta>
                    <TagContainer>
                      {article.tag.split(', ').map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </TagContainer>
                  </ArticleMeta>
                  
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleSummary 
                    expanded={isExpanded}
                    onClick={() => toggleArticle(article.id)}
                  >
                    {article.content}
                  </ArticleSummary>
                  <ExpandButton 
                    expanded={isExpanded}
                    onClick={() => toggleArticle(article.id)}
                  >
                    <ExpandButtonContent>
                      {isExpanded ? (
                        <>
                          <span>내용 접기</span>
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          <span>전체 내용 보기</span>
                          <ChevronDown size={16} />
                        </>
                      )}
                    </ExpandButtonContent>
                  </ExpandButton>
                  
                  <ArticleFooter>
                    <SourceText>출처: {new URL(article.url).hostname}</SourceText>
                    <ActionButtons>
                      <AskButton onClick={() => setSelectedArticle(article)}>
                        <MessageCircle />
                        <span>질문하기</span>
                      </AskButton>
                      <ViewLink 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span style={{ marginRight: '0.25rem' }}>원본 보기</span>
                        <ExternalLink size={16} />
                      </ViewLink>
                    </ActionButtons>
                  </ArticleFooter>
                </ArticleContent>
              </ArticleCard>
            )
          })}
          
          {loading && (
            <LoadingSpinner>
              <Spinner />
              <LoadingText>더 많은 기사를 불러오는 중...</LoadingText>
            </LoadingSpinner>
          )}
        </ArticleFeed>

        {scrollPosition > 100 && (
          <ScrollIndicator>
            <span>스크롤 위치: {Math.floor(scrollPosition)}px</span>
          </ScrollIndicator>
        )}

        {selectedArticle && (
          <QuestionModal>
            <ModalContent>
              <CloseButton onClick={closeModal}>×</CloseButton>
              <h3>{selectedArticle.title}</h3>
              <p>이 기사에 대해 궁금한 점을 질문해보세요.</p>
              <QuestionInput
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 입력하세요..."
              />
              <SubmitButton onClick={handleAskQuestion} disabled={isLoading}>
                {isLoading ? '답변 생성 중...' : '질문하기'}
              </SubmitButton>
              {answer && (
                <AnswerText>
                  <strong>답변:</strong>
                  <p>{answer}</p>
                </AnswerText>
              )}
            </ModalContent>
          </QuestionModal>
        )}

        <Footer>
          © {new Date().getFullYear()} AI 인사이트. All rights reserved.
        </Footer>
      </ContentWrapper>
    </Container>
  )
}

export default App
