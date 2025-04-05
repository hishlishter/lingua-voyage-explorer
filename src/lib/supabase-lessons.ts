
import { supabase } from "./supabase";

export interface Lesson {
  id: number;
  title: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order_index: number;
  created_at?: string;
}

export interface LessonTest {
  id: number;
  lesson_id: number;
  title: string;
  description?: string;
}

export interface LessonQuestion {
  id: number;
  test_id: number;
  text: string;
  options: {
    id: number;
    text: string;
    is_correct: boolean;
  }[];
}

export interface LessonWithTest extends Lesson {
  test?: LessonTest;
  questions?: LessonQuestion[];
}

// Fetch all lessons
export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Ошибка загрузки уроков:', error);
      throw error;
    }
    
    console.info('Успешно загружено уроков:', data.length);
    return data || [];
  } catch (error) {
    console.error('Непредвиденная ошибка при загрузке уроков:', error);
    return [];
  }
};

// Fetch a specific lesson with its test and questions
export const fetchLessonWithTest = async (lessonId: number): Promise<{ lesson: Lesson, test?: LessonTest, questions?: LessonQuestion[] }> => {
  try {
    // Get the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (lessonError) {
      console.error('Ошибка загрузки урока:', lessonError);
      throw lessonError;
    }
    
    // Get the associated test
    const { data: test, error: testError } = await supabase
      .from('lesson_tests')
      .select('*')
      .eq('lesson_id', lessonId)
      .single();
    
    if (testError && testError.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error('Ошибка загрузки теста:', testError);
    }
    
    let questions: LessonQuestion[] = [];
    if (test) {
      // Get the test questions
      const { data: questionData, error: questionsError } = await supabase
        .from('lesson_questions')
        .select(`
          id,
          test_id,
          text,
          options
        `)
        .eq('test_id', test.id);
      
      if (questionsError) {
        console.error('Ошибка загрузки вопросов теста:', questionsError);
      } else {
        questions = questionData || [];
      }
    }
    
    return { 
      lesson,
      test: test || undefined,
      questions: questions.length > 0 ? questions : undefined
    };
  } catch (error) {
    console.error('Ошибка при загрузке урока с тестом:', error);
    throw error;
  }
};

// Save test result
export const saveLessonTestResult = async (
  userId: string, 
  lessonId: number, 
  score: number, 
  totalQuestions: number
): Promise<boolean> => {
  try {
    // Check if the user has already taken this test
    const { data: existingResult } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();
    
    const isPerfectScore = score === totalQuestions;
    
    if (existingResult) {
      // Update existing result if new score is better
      if (existingResult.score < score) {
        const { error } = await supabase
          .from('lesson_progress')
          .update({
            score: score,
            total_questions: totalQuestions,
            is_completed: isPerfectScore,
            updated_at: new Date()
          })
          .eq('id', existingResult.id);
        
        if (error) {
          console.error('Ошибка обновления результата теста:', error);
          return false;
        }
      }
    } else {
      // Insert new result
      const { error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          score: score,
          total_questions: totalQuestions,
          is_completed: isPerfectScore
        });
      
      if (error) {
        console.error('Ошибка сохранения результата теста:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении результата теста:', error);
    return false;
  }
};

// Fetch user's progress for all lessons
export const fetchUserLessonProgress = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Ошибка загрузки прогресса уроков:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Непредвиденная ошибка при загрузке прогресса уроков:', error);
    return [];
  }
};

// Initialize grammar lessons in database
export const initializeGrammarLessons = async (): Promise<void> => {
  try {
    // Check if we already have the 5 grammar lessons
    const { data: existingLessons, error: checkError } = await supabase
      .from('lessons')
      .select('id, title')
      .in('title', [
        'Present Simple', 
        'Present Continuous', 
        'Past Simple', 
        'Future Simple', 
        'Present Perfect'
      ]);
    
    if (checkError) {
      console.error('Ошибка при проверке существующих уроков:', checkError);
      return;
    }
    
    // If we already have all 5 lessons, don't add them again
    if (existingLessons && existingLessons.length >= 5) {
      console.log('Грамматические уроки уже существуют в базе данных');
      return;
    }
    
    // Define our 5 grammar lessons
    const grammarLessons = [
      {
        title: 'Present Simple',
        content: `
          <h2>Present Simple Tense</h2>
          
          <p>Present Simple is one of the most commonly used tenses in English. It's used to describe:</p>
          
          <ul>
            <li>Habits and routines: <em>I wake up at 7 AM every day.</em></li>
            <li>General truths and facts: <em>The sun rises in the east.</em></li>
            <li>States that remain unchanged: <em>He lives in London.</em></li>
            <li>Timetables and scheduled events: <em>The train leaves at 9:30.</em></li>
          </ul>
          
          <h3>Form</h3>
          
          <p>The form of Present Simple is as follows:</p>
          
          <p><strong>Positive:</strong></p>
          <ul>
            <li>I/You/We/They + verb (base form): <em>I work</em></li>
            <li>He/She/It + verb + -s: <em>She works</em></li>
          </ul>
          
          <p><strong>Negative:</strong></p>
          <ul>
            <li>I/You/We/They + do not/don't + verb (base form): <em>I don't work</em></li>
            <li>He/She/It + does not/doesn't + verb (base form): <em>She doesn't work</em></li>
          </ul>
          
          <p><strong>Question:</strong></p>
          <ul>
            <li>Do + I/you/we/they + verb (base form): <em>Do you work?</em></li>
            <li>Does + he/she/it + verb (base form): <em>Does she work?</em></li>
          </ul>
          
          <h3>Spelling Rules for Third Person Singular (-s)</h3>
          
          <ol>
            <li>For most verbs: add -s (work → works)</li>
            <li>For verbs ending in -ch, -sh, -ss, -x, -o: add -es (watch → watches, go → goes)</li>
            <li>For verbs ending in consonant + y: change y to i and add -es (study → studies)</li>
            <li>Exception: verbs ending in vowel + y: just add -s (play → plays)</li>
          </ol>
          
          <h3>Time Expressions</h3>
          
          <p>Present Simple is often used with these time expressions:</p>
          <ul>
            <li>always, usually, often, sometimes, rarely, never</li>
            <li>every day/week/month/year</li>
            <li>on Mondays/Tuesdays, etc.</li>
            <li>once/twice a week</li>
          </ul>
          
          <h3>Examples</h3>
          
          <ul>
            <li>She works in a bank. (positive)</li>
            <li>They don't live in Paris. (negative)</li>
            <li>Do you speak English? (question)</li>
            <li>He doesn't eat meat. (negative)</li>
            <li>Sarah goes to the gym three times a week. (positive with time expression)</li>
            <li>I don't usually drink coffee in the evening. (negative with frequency adverb)</li>
          </ul>
        `,
        level: 'beginner',
        order_index: 1
      },
      {
        title: 'Present Continuous',
        content: `
          <h2>Present Continuous Tense</h2>
          
          <p>The Present Continuous tense (also called Present Progressive) is used to talk about:</p>
          
          <ul>
            <li>Actions happening right now: <em>I am studying English now.</em></li>
            <li>Temporary situations: <em>She is staying with her parents until she finds an apartment.</em></li>
            <li>Planned future arrangements: <em>We are meeting Tom at the airport tomorrow.</em></li>
            <li>Current trends: <em>More people are using public transportation these days.</em></li>
          </ul>
          
          <h3>Form</h3>
          
          <p>The Present Continuous is formed with the present tense of the verb "to be" + the present participle (verb + -ing):</p>
          
          <p><strong>Positive:</strong></p>
          <ul>
            <li>I am (I'm) + verb-ing: <em>I am working</em></li>
            <li>You/We/They are (You're/We're/They're) + verb-ing: <em>You are working</em></li>
            <li>He/She/It is (He's/She's/It's) + verb-ing: <em>She is working</em></li>
          </ul>
          
          <p><strong>Negative:</strong></p>
          <ul>
            <li>I am not (I'm not) + verb-ing: <em>I am not working</em></li>
            <li>You/We/They are not (aren't) + verb-ing: <em>You aren't working</em></li>
            <li>He/She/It is not (isn't) + verb-ing: <em>She isn't working</em></li>
          </ul>
          
          <p><strong>Question:</strong></p>
          <ul>
            <li>Am + I + verb-ing: <em>Am I working?</em></li>
            <li>Are + you/we/they + verb-ing: <em>Are you working?</em></li>
            <li>Is + he/she/it + verb-ing: <em>Is she working?</em></li>
          </ul>
          
          <h3>Spelling Rules for -ing Form</h3>
          
          <ol>
            <li>For most verbs: add -ing (work → working)</li>
            <li>For verbs ending in -e: remove -e and add -ing (write → writing)</li>
            <li>For verbs ending in consonant + vowel + consonant (when the last syllable is stressed): double the final consonant and add -ing (sit → sitting)</li>
            <li>For verbs ending in -ie: change -ie to y and add -ing (lie → lying)</li>
          </ol>
          
          <h3>Time Expressions</h3>
          
          <p>Present Continuous is often used with these time expressions:</p>
          <ul>
            <li>now, right now, at the moment, at present</li>
            <li>today, this week/month/year</li>
            <li>Look! Listen!</li>
            <li>currently, presently</li>
          </ul>
          
          <h3>Verbs Not Usually Used in Continuous Form</h3>
          
          <p>Some verbs are rarely used in continuous forms because they describe states rather than actions:</p>
          <ul>
            <li>Mental states: know, understand, believe, think (opinion), remember, forget, recognize</li>
            <li>Emotions: love, hate, like, prefer, want, wish, need</li>
            <li>Senses: see, hear, smell, taste, feel</li>
            <li>Possession: have, own, possess, belong</li>
            <li>Others: be, contain, consist, seem, appear, exist, matter</li>
          </ul>
          
          <h3>Examples</h3>
          
          <ul>
            <li>I'm watching TV at the moment. (action happening now)</li>
            <li>They aren't studying for their exams. (negative)</li>
            <li>Is she working on a new project? (question)</li>
            <li>We're staying at a hotel for the next two weeks. (temporary situation)</li>
            <li>I'm meeting John at the station at 5 PM. (future arrangement)</li>
            <li>More and more people are working from home these days. (trend)</li>
          </ul>
        `,
        level: 'beginner',
        order_index: 2
      },
      {
        title: 'Past Simple',
        content: `
          <h2>Past Simple Tense</h2>
          
          <p>The Past Simple (also called Simple Past) is used to talk about:</p>
          
          <ul>
            <li>Completed actions in the past: <em>I watched a movie last night.</em></li>
            <li>Series of completed actions: <em>I woke up, got dressed, and went to work.</em></li>
            <li>Past habits or repeated actions: <em>When I was a child, I played soccer every weekend.</em></li>
            <li>States that existed for a period in the past: <em>She lived in Paris for five years.</em></li>
          </ul>
          
          <h3>Form</h3>
          
          <p>The Past Simple has different forms for regular and irregular verbs:</p>
          
          <h4>Regular Verbs</h4>
          
          <p><strong>Positive:</strong></p>
          <ul>
            <li>Subject + verb + -ed: <em>I worked</em></li>
          </ul>
          
          <p><strong>Negative:</strong></p>
          <ul>
            <li>Subject + did not/didn't + verb (base form): <em>I didn't work</em></li>
          </ul>
          
          <p><strong>Question:</strong></p>
          <ul>
            <li>Did + subject + verb (base form): <em>Did you work?</em></li>
          </ul>
          
          <h4>Irregular Verbs</h4>
          
          <p><strong>Positive:</strong></p>
          <ul>
            <li>Subject + past form of the verb (varies): <em>I went, She saw, They took</em></li>
          </ul>
          
          <p><strong>Negative:</strong></p>
          <ul>
            <li>Subject + did not/didn't + verb (base form): <em>I didn't go, She didn't see, They didn't take</em></li>
          </ul>
          
          <p><strong>Question:</strong></p>
          <ul>
            <li>Did + subject + verb (base form): <em>Did you go? Did she see? Did they take?</em></li>
          </ul>
          
          <h3>Spelling Rules for Regular Verbs</h3>
          
          <ol>
            <li>For most verbs: add -ed (work → worked)</li>
            <li>For verbs ending in -e: add -d (live → lived)</li>
            <li>For verbs ending in consonant + y: change y to i and add -ed (study → studied)</li>
            <li>For verbs ending in vowel + y: just add -ed (play → played)</li>
            <li>For verbs ending in consonant + vowel + consonant (when the last syllable is stressed): double the final consonant and add -ed (stop → stopped)</li>
          </ol>
          
          <h3>Common Irregular Verbs</h3>
          
          <table border="1" cellpadding="5">
            <tr>
              <th>Base Form</th>
              <th>Past Simple</th>
            </tr>
            <tr><td>be</td><td>was/were</td></tr>
            <tr><td>begin</td><td>began</td></tr>
            <tr><td>break</td><td>broke</td></tr>
            <tr><td>bring</td><td>brought</td></tr>
            <tr><td>buy</td><td>bought</td></tr>
            <tr><td>come</td><td>came</td></tr>
            <tr><td>do</td><td>did</td></tr>
            <tr><td>eat</td><td>ate</td></tr>
            <tr><td>feel</td><td>felt</td></tr>
            <tr><td>find</td><td>found</td></tr>
            <tr><td>get</td><td>got</td></tr>
            <tr><td>give</td><td>gave</td></tr>
            <tr><td>go</td><td>went</td></tr>
            <tr><td>have</td><td>had</td></tr>
            <tr><td>hear</td><td>heard</td></tr>
            <tr><td>know</td><td>knew</td></tr>
            <tr><td>make</td><td>made</td></tr>
            <tr><td>read</td><td>read</td></tr>
            <tr><td>run</td><td>ran</td></tr>
            <tr><td>say</td><td>said</td></tr>
            <tr><td>see</td><td>saw</td></tr>
            <tr><td>speak</td><td>spoke</td></tr>
            <tr><td>take</td><td>took</td></tr>
            <tr><td>tell</td><td>told</td></tr>
            <tr><td>think</td><td>thought</td></tr>
            <tr><td>write</td><td>wrote</td></tr>
          </table>
          
          <h3>Time Expressions</h3>
          
          <p>Past Simple is often used with these time expressions:</p>
          <ul>
            <li>yesterday, last night/week/month/year</li>
            <li>in 2010, in the 1990s</li>
            <li>ago (two days ago, a long time ago)</li>
            <li>when + past event</li>
          </ul>
          
          <h3>Examples</h3>
          
          <ul>
            <li>She visited her grandmother last Sunday. (regular verb, positive)</li>
            <li>They didn't finish their homework. (regular verb, negative)</li>
            <li>Did you enjoy the concert? (regular verb, question)</li>
            <li>I went to the beach yesterday. (irregular verb, positive)</li>
            <li>He didn't see the movie. (irregular verb, negative)</li>
            <li>Did she take the bus? (irregular verb, question)</li>
            <li>When I was young, I played the piano every day. (past habit)</li>
          </ul>
        `,
        level: 'beginner',
        order_index: 3
      },
      {
        title: 'Future Simple',
        content: `
          <h2>Future Simple Tense</h2>
          
          <p>The Future Simple tense (also called Simple Future) is used to talk about:</p>
          
          <ul>
            <li>Predictions about the future: <em>I think it will rain tomorrow.</em></li>
            <li>Spontaneous decisions made at the moment of speaking: <em>I'll help you with that.</em></li>
            <li>Promises, offers, threats, refusals: <em>I'll call you later.</em></li>
            <li>Facts about the future: <em>The sun will rise at 6:30 tomorrow.</em></li>
          </ul>
          
          <h3>Form</h3>
          
          <p>Future Simple is formed with "will" + the base form of the verb:</p>
          
          <p><strong>Positive:</strong></p>
          <ul>
            <li>Subject + will (I'll, You'll, etc.) + verb (base form): <em>I will work</em></li>
          </ul>
          
          <p><strong>Negative:</strong></p>
          <ul>
            <li>Subject + will not/won't + verb (base form): <em>I won't work</em></li>
          </ul>
          
          <p><strong>Question:</strong></p>
          <ul>
            <li>Will + subject + verb (base form): <em>Will you work?</em></li>
          </ul>
          
          <h3>Other Ways to Express Future</h3>
          
          <p>In English, there are several ways to talk about the future:</p>
          
          <h4>1. Be going to</h4>
          <p>Used for plans, intentions, and predictions based on present evidence:</p>
          <ul>
            <li>I'm going to study medicine. (plan/intention)</li>
            <li>Look at those clouds! It's going to rain. (prediction based on evidence)</li>
          </ul>
          
          <h4>2. Present Continuous</h4>
          <p>Used for fixed arrangements in the near future:</p>
          <ul>
            <li>I'm meeting John at the airport tomorrow.</li>
            <li>We're having dinner with Tom's parents on Saturday.</li>
          </ul>
          
          <h4>3. Present Simple</h4>
          <p>Used for scheduled events, timetables, programs:</p>
          <ul>
            <li>The train leaves at 8:30 tomorrow morning.</li>
            <li>The conference starts next Monday.</li>
          </ul>
          
          <h3>When to Use Future Simple vs. Other Forms</h3>
          
          <table border="1" cellpadding="5">
            <tr>
              <th>Future Form</th>
              <th>Main Uses</th>
              <th>Example</th>
            </tr>
            <tr>
              <td>Will</td>
              <td>Predictions, spontaneous decisions, promises</td>
              <td>I think she will pass the exam.<br>I'll call you later.</td>
            </tr>
            <tr>
              <td>Be going to</td>
              <td>Intentions, plans, evident predictions</td>
              <td>I'm going to learn Spanish next year.<br>Look at the sky. It's going to snow.</td>
            </tr>
            <tr>
              <td>Present Continuous</td>
              <td>Fixed arrangements</td>
              <td>I'm flying to London next week.</td>
            </tr>
            <tr>
              <td>Present Simple</td>
              <td>Schedules, timetables</td>
              <td>The movie begins at 8 PM.</td>
            </tr>
          </table>
          
          <h3>Time Expressions</h3>
          
          <p>Future Simple is often used with these time expressions:</p>
          <ul>
            <li>tomorrow, the day after tomorrow</li>
            <li>next week/month/year</li>
            <li>in the future, in 2030, in a few days</li>
            <li>soon, later, tonight</li>
          </ul>
          
          <h3>Examples</h3>
          
          <ul>
            <li>She will graduate next year. (prediction)</li>
            <li>I won't be available tomorrow. (negative)</li>
            <li>Will they attend the meeting? (question)</li>
            <li>It's cold in here. I'll close the window. (spontaneous decision)</li>
            <li>Don't worry, I'll help you with your homework. (promise)</li>
            <li>I think robots will do most manual jobs in the future. (prediction about distant future)</li>
          </ul>
        `,
        level: 'beginner',
        order_index: 4
      },
      {
        title: 'Present Perfect',
        content: `
          <h2>Present Perfect Tense</h2>
          
          <p>The Present Perfect tense is used to connect the past with the present. It's used to talk about:</p>
          
          <ul>
            <li>Experiences (without saying exactly when they happened): <em>I have visited Paris.</em></li>
            <li>Recent actions whose results are still relevant: <em>I've lost my keys (and I still can't find them).</em></li>
            <li>Unfinished time periods: <em>I have studied English for five years (and I'm still studying it).</em></li>
            <li>Actions that happened at an unspecified time in the past: <em>Someone has taken my book.</em></li>
          </ul>
          
          <h3>Form</h3>
          
          <p>Present Perfect is formed with the present tense of the auxiliary verb "have" + the past participle:</p>
          
          <p><strong>Positive:</strong></p>
          <ul>
            <li>I/You/We/They have ('ve) + past participle: <em>I have worked</em></li>
            <li>He/She/It has ('s) + past participle: <em>She has worked</em></li>
          </ul>
          
          <p><strong>Negative:</strong></p>
          <ul>
            <li>I/You/We/They have not (haven't) + past participle: <em>I haven't worked</em></li>
            <li>He/She/It has not (hasn't) + past participle: <em>She hasn't worked</em></li>
          </ul>
          
          <p><strong>Question:</strong></p>
          <ul>
            <li>Have + I/you/we/they + past participle: <em>Have you worked?</em></li>
            <li>Has + he/she/it + past participle: <em>Has she worked?</em></li>
          </ul>
          
          <h3>Past Participle Forms</h3>
          
          <p><strong>Regular verbs:</strong> same as past simple (add -ed)</p>
          <ul>
            <li>work → worked</li>
            <li>play → played</li>
            <li>study → studied</li>
          </ul>
          
          <p><strong>Irregular verbs:</strong> vary (third column in verb tables)</p>
          <table border="1" cellpadding="5">
            <tr>
              <th>Base Form</th>
              <th>Past Simple</th>
              <th>Past Participle</th>
            </tr>
            <tr><td>be</td><td>was/were</td><td>been</td></tr>
            <tr><td>begin</td><td>began</td><td>begun</td></tr>
            <tr><td>break</td><td>broke</td><td>broken</td></tr>
            <tr><td>bring</td><td>brought</td><td>brought</td></tr>
            <tr><td>buy</td><td>bought</td><td>bought</td></tr>
            <tr><td>come</td><td>came</td><td>come</td></tr>
            <tr><td>do</td><td>did</td><td>done</td></tr>
            <tr><td>eat</td><td>ate</td><td>eaten</td></tr>
            <tr><td>feel</td><td>felt</td><td>felt</td></tr>
            <tr><td>find</td><td>found</td><td>found</td></tr>
            <tr><td>get</td><td>got</td><td>got/gotten</td></tr>
            <tr><td>give</td><td>gave</td><td>given</td></tr>
            <tr><td>go</td><td>went</td><td>gone/been</td></tr>
            <tr><td>have</td><td>had</td><td>had</td></tr>
            <tr><td>know</td><td>knew</td><td>known</td></tr>
            <tr><td>make</td><td>made</td><td>made</td></tr>
            <tr><td>see</td><td>saw</td><td>seen</td></tr>
            <tr><td>speak</td><td>spoke</td><td>spoken</td></tr>
            <tr><td>take</td><td>took</td><td>taken</td></tr>
            <tr><td>write</td><td>wrote</td><td>written</td></tr>
          </table>
          
          <h3>Time Expressions with Present Perfect</h3>
          
          <p><strong>Common time expressions:</strong></p>
          <ul>
            <li>for (a period of time): <em>for five years, for a long time</em></li>
            <li>since (a starting point): <em>since 2010, since I was a child</em></li>
            <li>just (a very recent past): <em>I have just finished my homework.</em></li>
            <li>already (something happened sooner than expected): <em>She has already left.</em></li>
            <li>yet (used in questions and negatives about expected events): <em>Have you finished yet? I haven't finished yet.</em></li>
            <li>ever (at any time in your life): <em>Have you ever been to Japan?</em></li>
            <li>never (at no time in your life): <em>I have never eaten sushi.</em></li>
            <li>recently, lately: <em>I haven't seen him recently.</em></li>
          </ul>
          
          <h3>Present Perfect vs. Past Simple</h3>
          
          <table border="1" cellpadding="5">
            <tr>
              <th>Present Perfect</th>
              <th>Past Simple</th>
            </tr>
            <tr>
              <td>Connects past to present</td>
              <td>Talks about finished past actions</td>
            </tr>
            <tr>
              <td>Doesn't specify when exactly something happened</td>
              <td>Usually specifies when something happened</td>
            </tr>
            <tr>
              <td>I have visited Paris. (sometime in my life, no specific time mentioned)</td>
              <td>I visited Paris last summer. (specific time mentioned)</td>
            </tr>
            <tr>
              <td>I have lost my keys. (and I still can't find them - present relevance)</td>
              <td>I lost my keys yesterday, but I found them later. (completed past action)</td>
            </tr>
          </table>
          
          <h3>Examples</h3>
          
          <ul>
            <li>I have seen that movie three times. (experience)</li>
            <li>She has broken her arm. (recent action with present result - her arm is still broken)</li>
            <li>They haven't arrived yet. (negative - expected but not happened so far)</li>
            <li>Have you ever tried Thai food? (question about life experience)</li>
            <li>I have lived in this city for ten years. (unfinished time period - still living here)</li>
            <li>She has just left. (very recent action)</li>
            <li>I haven't read that book yet, but I plan to. (negative - expected but not happened)</li>
          </ul>
        `,
        level: 'intermediate',
        order_index: 5
      }
    ];
    
    // Insert the lessons into the database
    for (const lesson of grammarLessons) {
      const { data: newLesson, error } = await supabase
        .from('lessons')
        .insert([lesson])
        .select();
      
      if (error) {
        console.error(`Ошибка добавления урока "${lesson.title}":`, error);
        continue;
      }
      
      // Now create a test for this lesson
      const lessonId = newLesson[0].id;
      const testTitle = `Тест: ${lesson.title}`;
      
      const { data: newTest, error: testError } = await supabase
        .from('lesson_tests')
        .insert([{
          lesson_id: lessonId,
          title: testTitle,
          description: `Проверьте ваше понимание темы "${lesson.title}"`
        }])
        .select();
      
      if (testError) {
        console.error(`Ошибка создания теста для урока "${lesson.title}":`, testError);
        continue;
      }
      
      // Create questions for each test
      const testId = newTest[0].id;
      let questions = [];
      
      // Generate different questions based on the lesson topic
      if (lesson.title === 'Present Simple') {
        questions = [
          {
            text: "When do we use Present Simple?",
            options: [
              { text: "To talk about actions happening right now", is_correct: false },
              { text: "To talk about future plans", is_correct: false },
              { text: "To talk about habits and routines", is_correct: true },
              { text: "To talk about past experiences", is_correct: false }
            ]
          },
          {
            text: "Which sentence is in Present Simple?",
            options: [
              { text: "She is working now", is_correct: false },
              { text: "She works every day", is_correct: true },
              { text: "She has worked here", is_correct: false },
              { text: "She will work tomorrow", is_correct: false }
            ]
          },
          {
            text: "What is the correct form for third person singular?",
            options: [
              { text: "She play tennis", is_correct: false },
              { text: "She playing tennis", is_correct: false },
              { text: "She plays tennis", is_correct: true },
              { text: "She is play tennis", is_correct: false }
            ]
          },
          {
            text: "How do we form questions in Present Simple?",
            options: [
              { text: "Do/Does + subject + verb", is_correct: true },
              { text: "Is/Are/Am + subject + verb", is_correct: false },
              { text: "Have/Has + subject + verb", is_correct: false },
              { text: "Will + subject + verb", is_correct: false }
            ]
          },
          {
            text: "Which time expression is NOT typically used with Present Simple?",
            options: [
              { text: "Every day", is_correct: false },
              { text: "Usually", is_correct: false },
              { text: "Right now", is_correct: true },
              { text: "Once a week", is_correct: false }
            ]
          }
        ];
      } else if (lesson.title === 'Present Continuous') {
        questions = [
          {
            text: "When do we use Present Continuous?",
            options: [
              { text: "To talk about habits", is_correct: false },
              { text: "To talk about actions happening right now", is_correct: true },
              { text: "To talk about completed actions", is_correct: false },
              { text: "To talk about general truths", is_correct: false }
            ]
          },
          {
            text: "How do we form the Present Continuous?",
            options: [
              { text: "do/does + verb", is_correct: false },
              { text: "have/has + verb", is_correct: false },
              { text: "am/is/are + verb + -ing", is_correct: true },
              { text: "will + verb", is_correct: false }
            ]
          },
          {
            text: "Which sentence is in Present Continuous?",
            options: [
              { text: "She works at a bank", is_correct: false },
              { text: "She has worked at a bank", is_correct: false },
              { text: "She worked at a bank", is_correct: false },
              { text: "She is working at a bank", is_correct: true }
            ]
          },
          {
            text: "Which verb is NOT normally used in continuous form?",
            options: [
              { text: "play", is_correct: false },
              { text: "run", is_correct: false },
              { text: "know", is_correct: true },
              { text: "read", is_correct: false }
            ]
          },
          {
            text: "Which time expression is typically used with Present Continuous?",
            options: [
              { text: "Every day", is_correct: false },
              { text: "Last week", is_correct: false },
              { text: "Right now", is_correct: true },
              { text: "Yesterday", is_correct: false }
            ]
          }
        ];
      } else if (lesson.title === 'Past Simple') {
        questions = [
          {
            text: "When do we use Past Simple?",
            options: [
              { text: "To talk about actions happening now", is_correct: false },
              { text: "To talk about completed actions in the past", is_correct: true },
              { text: "To talk about future plans", is_correct: false },
              { text: "To talk about experiences without a specific time", is_correct: false }
            ]
          },
          {
            text: "How do we form the Past Simple of regular verbs?",
            options: [
              { text: "add -s", is_correct: false },
              { text: "add -ing", is_correct: false },
              { text: "add -ed", is_correct: true },
              { text: "add -en", is_correct: false }
            ]
          },
          {
            text: "Which sentence is in Past Simple?",
            options: [
              { text: "She works here", is_correct: false },
              { text: "She is working here", is_correct: false },
              { text: "She worked here", is_correct: true },
              { text: "She has worked here", is_correct: false }
            ]
          },
          {
            text: "What is the Past Simple form of 'go'?",
            options: [
              { text: "goed", is_correct: false },
              { text: "gone", is_correct: false },
              { text: "went", is_correct: true },
              { text: "going", is_correct: false }
            ]
          },
          {
            text: "How do we form questions in Past Simple?",
            options: [
              { text: "Did + subject + verb (base form)", is_correct: true },
              { text: "Do/Does + subject + verb", is_correct: false },
              { text: "Is/Are/Am + subject + verb + ing", is_correct: false },
              { text: "Have/Has + subject + past participle", is_correct: false }
            ]
          }
        ];
      } else if (lesson.title === 'Future Simple') {
        questions = [
          {
            text: "When do we use Future Simple with 'will'?",
            options: [
              { text: "For fixed arrangements", is_correct: false },
              { text: "For predictions about the future", is_correct: true },
              { text: "For past experiences", is_correct: false },
              { text: "For habits and routines", is_correct: false }
            ]
          },
          {
            text: "How do we form the Future Simple?",
            options: [
              { text: "subject + am/is/are + going to + verb", is_correct: false },
              { text: "subject + will + verb (base form)", is_correct: true },
              { text: "subject + am/is/are + verb + -ing", is_correct: false },
              { text: "subject + have/has + past participle", is_correct: false }
            ]
          },
          {
            text: "Which sentence expresses a spontaneous decision?",
            options: [
              { text: "I'm going to help you tomorrow", is_correct: false },
              { text: "I'm helping you tomorrow", is_correct: false },
              { text: "I'll help you with that", is_correct: true },
              { text: "I help you every day", is_correct: false }
            ]
          },
          {
            text: "Which is NOT a way to express future in English?",
            options: [
              { text: "Present Simple (The train leaves at 8)", is_correct: false },
              { text: "Present Continuous (I'm meeting John tomorrow)", is_correct: false },
              { text: "Will (I will call you later)", is_correct: false },
              { text: "Past Simple (I worked tomorrow)", is_correct: true }
            ]
          },
          {
            text: "Which time expression is used with Future Simple?",
            options: [
              { text: "Yesterday", is_correct: false },
              { text: "Right now", is_correct: false },
              { text: "Next week", is_correct: true },
              { text: "Last month", is_correct: false }
            ]
          }
        ];
      } else if (lesson.title === 'Present Perfect') {
        questions = [
          {
            text: "When do we use Present Perfect?",
            options: [
              { text: "To connect past actions with the present", is_correct: true },
              { text: "To talk about specific moments in the past", is_correct: false },
              { text: "To talk about the future", is_correct: false },
              { text: "To talk about habits", is_correct: false }
            ]
          },
          {
            text: "How do we form the Present Perfect?",
            options: [
              { text: "subject + did + verb", is_correct: false },
              { text: "subject + will + verb", is_correct: false },
              { text: "subject + am/is/are + verb + -ing", is_correct: false },
              { text: "subject + have/has + past participle", is_correct: true }
            ]
          },
          {
            text: "Which sentence is in Present Perfect?",
            options: [
              { text: "She works here", is_correct: false },
              { text: "She is working here", is_correct: false },
              { text: "She worked here", is_correct: false },
              { text: "She has worked here", is_correct: true }
            ]
          },
          {
            text: "Which time expression is NOT used with Present Perfect?",
            options: [
              { text: "for five years", is_correct: false },
              { text: "since 2010", is_correct: false },
              { text: "yesterday", is_correct: true },
              { text: "just", is_correct: false }
            ]
          },
          {
            text: "What is the difference between Present Perfect and Past Simple?",
            options: [
              { text: "Present Perfect connects past to present; Past Simple talks about finished past actions", is_correct: true },
              { text: "Present Perfect is about the future; Past Simple is about the past", is_correct: false },
              { text: "Present Perfect is formal; Past Simple is informal", is_correct: false },
              { text: "There is no difference", is_correct: false }
            ]
          }
        ];
      }
      
      // Insert questions for this test
      for (const question of questions) {
        const { error: questionError } = await supabase
          .from('lesson_questions')
          .insert({
            test_id: testId,
            text: question.text,
            options: question.options
          });
        
        if (questionError) {
          console.error('Ошибка добавления вопроса:', questionError);
        }
      }
    }
    
    console.log('Грамматические уроки успешно инициализированы');
  } catch (error) {
    console.error('Ошибка инициализации грамматических уроков:', error);
  }
};
