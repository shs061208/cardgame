export async function saveGameResult(name: string, finishtime: number) {
  /**
   * 주의: 아래 SCRIPT_URL에 구글 앱스 스크립트 배포 후 생성된 '웹 앱 URL'을 넣어야 정상 작동합니다.
   * 작업 가이드는 'google_sheets_setup.md' 파일을 확인해주세요.
   */
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUZ4EZrgVXBiHhS6JnWXuImpcOIU9jl3TrVLgHEk-yeB-DqeRGlqeTAenwDxDEkbDv/exec";

  if (!SCRIPT_URL || SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
    console.warn("데이터 저장을 위한 Google Apps Script URL이 설정되지 않았습니다.");
    return;
  }

  try {
    // Google Apps Script는 Redirect를 사용하기 때문에 no-cors 또는 특별한 처리가 필요할 수 있습니다.
    // 여기서는 가장 간단한 형태의 POST 요청을 보냅니다.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        finishtime: finishtime,
      }),
    });
    
    console.log(`성공 기록 저장 완료: ${name} (${finishtime}초)`);
  } catch (error) {
    console.error("데이터 저장 중 오류가 발생했습니다:", error);
  }
}

export async function getTopRankings() {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUZ4EZrgVXBiHhS6JnWXuImpcOIU9jl3TrVLgHEk-yeB-DqeRGlqeTAenwDxDEkbDv/exec";

  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) throw new Error("네트워크 응답이 올바르지 않습니다.");
    const data = await response.json();
    return data as { name: string; finishtime: number }[];
  } catch (error) {
    console.error("랭킹 정보를 가져오는 중 오류가 발생했습니다:", error);
    return [];
  }
}
