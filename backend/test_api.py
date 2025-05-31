#!/usr/bin/env python
"""
Simple API endpoint testing script
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8080"

def test_endpoint(url, method="GET", data=None, headers=None):
    """Test an API endpoint and return the result"""
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=5)
        
        return {
            'url': url,
            'status': response.status_code,
            'success': response.status_code < 400,
            'response': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'status': 'ERROR',
            'success': False,
            'response': str(e)
        }

def main():
    """Test all API endpoints"""
    print("🚀 Testing MyLugha API Endpoints\n")
    
    # Test basic GET endpoints
    get_endpoints = [
        (f"{BASE_URL}/api/", "API Root"),
        (f"{BASE_URL}/api/languages/", "Languages List"),
        (f"{BASE_URL}/api/contributions/", "Contributions List"),
        (f"{BASE_URL}/api/validations/", "Validations List"),
        (f"{BASE_URL}/admin/", "Admin Panel"),
    ]
    
    # Test POST endpoints that need authentication
    auth_endpoints = [
        (f"{BASE_URL}/api/auth/profile/", "User Profile (requires auth)"),
    ]
    
    # Test POST-only endpoints
    post_endpoints = [
        (f"{BASE_URL}/api/auth/register/", "User Registration (POST only)"),
    ]
    
    results = []
    
    print("📝 Testing GET endpoints:")
    for endpoint, name in get_endpoints:
        print(f"Testing: {name}")
        result = test_endpoint(endpoint)
        results.append(result)
        
        if result['success']:
            print(f"✅ {result['status']} - Success")
        else:
            print(f"❌ {result['status']} - Failed")
            print(f"   Error: {result['response']}")
        print()
    
    print("🔐 Testing authentication-required endpoints:")
    for endpoint, name in auth_endpoints:
        print(f"Testing: {name}")
        result = test_endpoint(endpoint)
        results.append(result)
        
        # For auth endpoints, 401 is expected without credentials
        if result['status'] == 401:
            print(f"✅ 401 - Correctly requires authentication")
        elif result['success']:
            print(f"✅ {result['status']} - Success")
        else:
            print(f"❌ {result['status']} - Unexpected error")
            print(f"   Error: {result['response']}")
        print()
    
    print("📮 Testing POST-only endpoints:")
    for endpoint, name in post_endpoints:
        print(f"Testing: {name}")
        result = test_endpoint(endpoint)
        results.append(result)
        
        # For POST-only endpoints, 405 is expected for GET
        if result['status'] == 405:
            print(f"✅ 405 - Correctly requires POST method")
        elif result['success']:
            print(f"✅ {result['status']} - Success")
        else:
            print(f"❌ {result['status']} - Unexpected error")
            print(f"   Error: {result['response']}")
        print()
    
    # Summary
    successful = sum(1 for r in results if r['success'] or r['status'] in [401, 405])
    total = len(results)
    
    print(f"📊 Summary: {successful}/{total} endpoints behaving correctly")
    
    if successful < total:
        print("\n🔍 Actual issues found:")
        for result in results:
            if not result['success'] and result['status'] not in [401, 405]:
                print(f"   - {result['url']}: {result['response']}")
    else:
        print("\n🎉 All API endpoints are working correctly!")

if __name__ == "__main__":
    main()
